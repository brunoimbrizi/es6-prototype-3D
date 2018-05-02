export default class UIAudioBars {

	constructor(canvas) {
		this.canvas = canvas;
		this.audio = app.audio;

		this.audio.on('audio:peak', this.onAudioPeak.bind(this));

		// colors
		this.peakDetectColor = this.peakDefaultColor = '#b32435';
		this.peakDetectedColor = '#FFF';
		this.peakCutOffColor = 'rgba(100, 100, 100, 0.5)';
		this.defaultColor = '#444';

		this.initCanvas();
	}

	initCanvas() {
		if (!this.canvas) {
			this.canvas = document.createElement('canvas');
			this.canvas.width = 300;
			this.canvas.height = 200;
			document.body.appendChild(this.canvas);
		}

		this.ctx = this.canvas.getContext('2d');
		this.ctx.width = this.canvas.width;
		this.ctx.height = this.canvas.height;
	}

	clear() {
		this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height);
	}

	draw() {
		this.clear();

		const height = this.ctx.height * 0.8;
		const peakDetectIndex = this.audio.peakDetectIndex;

		// average
		const avgLevel = this.audio.avgLevel;
		const avgW = 20;
		const avgH = avgLevel * height + 2;
		const avgOffset = 4;
		const avgX = this.ctx.width - avgW - avgOffset;

		this.ctx.fillStyle = (peakDetectIndex < 0) ? this.peakDetectColor : this.defaultColor;
		this.ctx.fillRect(avgX, this.ctx.height - avgH, avgW, avgH);

		// levels
		const levels = this.audio.levelsData;
		const levelsOffset = 2;
		const levelsTotalWidth = this.ctx.width - avgW - avgOffset * 2;
		const levelsW = floor((levelsTotalWidth - levels.length * levelsOffset) / levels.length);
		
		for (let i = 0; i < levels.length; i++) {
			const h = levels[i] * height + 2;
			const x = i * (levelsW + levelsOffset);
			const y = this.ctx.height - h;

			this.ctx.fillStyle = (i === peakDetectIndex) ? this.peakDetectColor : this.defaultColor;
			this.ctx.fillRect(x, y, levelsW, h);
		}

		// peak
		const peak = this.audio.peakLast;
		const peakX = (peakDetectIndex < 0) ? avgX : peakDetectIndex * (levelsW + levelsOffset);
		const peakY = peak * height + 2;
		const peakW = (peakDetectIndex < 0) ? avgW : levelsW;
		const peakH = 2;

		this.ctx.fillStyle = this.peakDetectColor;
		this.ctx.fillRect(peakX, this.ctx.height - peakY, peakW, peakH);

		// peak cutoff
		const cutoff = this.audio.peakCutOff;
		const cutoffY = cutoff * height + 2;
		const cutoffH = 1;

		this.ctx.fillStyle = this.peakCutOffColor;
		this.ctx.fillRect(0, this.ctx.height - cutoffY, this.ctx.width, cutoffH);

		// reset peak color
		this.peakDetectColor = this.peakDefaultColor;
	}

	onAudioPeak(e) {
		this.peakDetectColor = this.peakDetectedColor;
	}
}
