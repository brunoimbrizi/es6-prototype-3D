import EventEmitter from 'events';
// import 'visibly.js';

export default class AppAudio extends EventEmitter {

	get FFT_SIZE() { return 1024; }
	get DISTRIBUTION_LINEAR() { return 0; }
	get DISTRIBUTION_EXPONENTIAL() { return 1; }

	static get AUDIO_PEAK() 	{ return 'audio:peak'; }
	static get AUDIO_LOAD() 	{ return 'audio:load'; }
	static get AUDIO_DECODE() 	{ return 'audio:decode'; }
	static get AUDIO_PLAY() 	{ return 'audio:play'; }
	static get AUDIO_PAUSE() 	{ return 'audio:pause'; }
	static get AUDIO_END() 		{ return 'audio:end'; }
	static get AUDIO_RESTART() 	{ return 'audio:restart'; }

	constructor() {
		super();

		this.currentTime = 0;
		this.lastTime = 0;
		this.duration = 0;

		this.initContext();
		this.initGain();
		this.initAnalyser();

		/*
		// pause/resume with page visibility
		visibly.onHidden(() => {
			this.wasPaused = this.paused;
			this.pause();
		});

		visibly.onVisible(() => {
			if (!this.wasPaused) this.play();
		});
		*/
	}

	initContext() {
		this.context = new AudioContext();
	}

	initGain() {
		this.gainNode = this.context.createGain();
		this.gainNode.gain.value = 1.0;
		this.gainNode.connect(this.context.destination);
	}

	initAnalyser() {
		// create an analyser node
		this.analyserNode = this.context.createAnalyser();
		this.analyserNode.fftSize = this.FFT_SIZE;
		this.analyserNode.smoothingTimeConstant = 0.85;
		this.analyserNode.connect(this.gainNode);

		this.levelsDistribution = this.DISTRIBUTION_LINEAR;
		this.levelsCount = 32;
		this.levelsData = [];

		this.binCount = this.analyserNode.frequencyBinCount; // FFT_SIZE / 2 
		this.binsPerLevel = Math.floor(this.binCount / this.levelsCount);

		// frequency domain
		this.freqByteData = new Uint8Array(this.binCount);

		this.peakCutOff = 0.25;
		this.peakLast = 0;
		this.peakDecay = 0.99;
		this.peakInterval = 30; // frames
		this.peakElapsed = 0;
		this.peakDetectIndex = -1; // average = -1

		this.sampleBands = [];
		// this.sampleBands = [1, 1, 2, 2, 4, 4, 8, 8, 16, 16, 32, 32, 64, 64, 128, 128]; // 16
		this.sampleBands = [1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 8, 8, 8, 8, 8, 8, 8, 8, 8, 16, 16, 16, 16, 16, 16, 32, 32, 32, 32, 32, 32, 64]; // 32

		// time domain
		this.amplitudeData = [];
		this.timeByteData = new Uint8Array(this.binCount);
	}

	initSource() {
		this.sourceNode = this.context.createBufferSource();
		this.sourceNode.onended = this.onSourceEnded.bind(this);
		this.sourceNode.connect(this.analyserNode);
	}

	dB(x) {
		if (x === 0) return 0;
		return 10 * Math.log10(x);
	}

	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------

	decode(arrayBuffer, cb) {
		this.context.decodeAudioData(arrayBuffer, (audioBuffer) => {
			this.stop();
			this.audioBuffer = audioBuffer;
			this.duration = this.audioBuffer.duration * 1000;
			if (cb) cb();
		}, (e) => {
			console.log('Error AppAudio.decode', e);
		});
	}

	play() {
		// if (this.ended) window.dispatchEvent(new Event(this.EVENT_AUDIO_RESTARTED));
		
		if (!this.sourceNode) this.pausedAt = 0;
		if (!this.audioBuffer) return;
		if (this.micStream) return;

		this.ended = false;
		this.paused = false;
		this.wasPaused = false;

		this.startedAt = Date.now() - this.pausedAt;

		this.initSource();
		this.sourceNode.buffer = this.audioBuffer;
		this.sourceNode.start(0, this.pausedAt / 1000);

		this.emit(AppAudio.AUDIO_PLAY, { currentTime: this.pausedAt });
	}

	pause() {
		if (!this.sourceNode) return;
		if (!this.sourceNode.stop) return;

		this.sourceNode.stop();

		this.pausedAt = Date.now() - this.startedAt;
		this.paused = true;

		this.emit(AppAudio.AUDIO_PAUSE, { currentTime: this.pausedAt });
	}

	stop() {
		if (!this.sourceNode) return;

		this.pausedAt = 0;
		this.sourceNode.onended = null;
		if (this.sourceNode.stop) this.sourceNode.stop();
		this.sourceNode.disconnect();
	}

	seek(time) {
		if (!this.sourceNode) return;
		if (time == undefined) return;
		if (time < 0) return;
		if (time > this.duration) return;

		this.ended = false;

		if (!this.paused) {
			this.sourceNode.onended = null;
			this.sourceNode.stop(0);
		}
		this.pausedAt = time * 1000;
		if (this.paused) this.currentTime = this.pausedAt;
		if (!this.paused) this.play();
	}

	mute() {
		this.pause();
		this.muted = true;
	}

	unmute() {
		if (this.paused) this.play();
		this.muted = false;
	}

	update() {
		if (!this.sourceNode) return;
		if (this.paused) return;

		this.updateFrequencyData();
		this.updateTimeData();
		this.detectPeak(this.peakDetectIndex);

		// set current time
		if (!this.ended) {
			this.lastTime = this.currentTime;
			this.currentTime = (this.paused) ? this.pausedAt : Date.now() - this.startedAt;
			if (isNaN(this.currentTime)) this.currentTime = 0;
		}
	}

	updateFrequencyData() {
		this.analyserNode.getByteFrequencyData(this.freqByteData);

		// levels
		if (this.levelsDistribution == this.DISTRIBUTION_LINEAR) {
			for (let i = 0; i < this.levelsCount; i++) {
				let sum = 0;
				for (let j = 0; j < this.binsPerLevel; j++) {
					sum += this.freqByteData[(i * this.binsPerLevel) + j];
				}

				// normalize
				// freqByteData values go from 0 to 256
				this.levelsData[i] = sum / this.binsPerLevel / 256;
				// this.levelsData[i] = this.dB(sum / this.binsPerLevel) / 256;
				// if (!i) console.log(sum, sum / this.binsPerLevel, this.dB(sum / this.binsPerLevel));
			}
		} else {
			let totalBands = 0;
			for (let i = 0; i < this.levelsCount; i++) {
				const bands = this.sampleBands[i];

				let sum = 0;
				for (let j = 0; j < bands; j++) {
					sum += this.freqByteData[j + totalBands];
				}

				this.levelsData[i] = sum / bands / 256;

				totalBands += bands;
			}
		}

		// average
		let sum = 0;
		for(let i = 0; i < this.levelsCount; i++) {
			sum += this.levelsData[i];
		}

		this.avgLevel = sum / this.levelsCount;
	}

	updateTimeData() {
		this.analyserNode.getByteTimeDomainData(this.timeByteData);

		for (let i = 0; i < this.binCount; i++) {
			this.amplitudeData[i] = this.timeByteData[i] / 256;
		}
	}

	detectPeak(index) {
		// default is average
		let value = this.avgLevel;
		// but it can be any level
		if (index > 0 && index < this.levelsCount) {
			value = this.levelsData[index];
		}

		// ignore if last peak happened before the min interval
		if (this.peakElapsed < this.peakInterval) {
			this.peakElapsed++;
			return;
		}

		// new peak
		if (value > this.peakLast && value > this.peakCutOff) {
			this.onPeak(value);
			this.peakLast = value * 1.2;
			this.peakElapsed = 0;
		} else {
			this.peakLast *= this.peakDecay;
		}
	}

	// ---------------------------------------------------------------------------------------------
	// EVENT HANDLERS
	// ---------------------------------------------------------------------------------------------

	onPeak(value) {
		this.emit(AppAudio.AUDIO_PEAK, { value });
	}

	onFileDrop(file, arrayBuffer) {
		this.decode(arrayBuffer, () => {
			this.fileName = file.name;
			this.play();
		});
	}

	onSourceEnded(e) {
		// console.log('AppAudio.onSourceEnded');
		if (this.paused) return;

		this.ended = true;
		this.paused = true;
		this.pausedAt = 0;

		this.currentTime = this.duration;

		// reset data
		for (let i = 0; i < this.levelsData.length; i++) { 
			this.levelsData[i] = 0;
		}
	}
}
