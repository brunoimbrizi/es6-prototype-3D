import ControlKit from '@brunoimbrizi/controlkit';
import Stats from 'stats.js';

import UIAudioBars from './UIAudioBars';

export default class UIView {

	constructor(view, audio) {
		this.view = app.view;
		this.audio = app.audio;

		this.audioSmoothing = this.audio.analyserNode.smoothingTimeConstant;
		this.audioPeakDecay = this.audio.peakDecay;
		this.audioPeakInterval = this.audio.peakInterval;
		this.audioPeakCutOff = this.audio.peakCutOff;
		this.audioPeakDetectIndex = this.audio.peakDetectIndex;
		this.audioDistributionOptions = ['linear', 'exponential'];
		this.audioDistribution = 0;

		this.range = [0, 1];
		this.rangeDecay = [0.9, 1.0];
		this.rangeInterval = [0, 60];
		this.rangeDetect = [-1, this.audio.levelsCount - 1];

		this.initControlKit();
		// this.initStats();
		this.initAudioBars();
	}

	initControlKit() {
		const that = this;

		this.controlKit = new ControlKit();
		this.controlKit.addPanel({ width: 300, enable: true })

		.addGroup({ label: 'Audio', enable: true })
		.addSelect(this, 'audioDistributionOptions', { label: 'distribution', selected: this.audioDistribution, onChange: (index) => { that.onAudioDistributionChange(index); } })
		.addCanvas({ label: 'bars', height: 100 })
		.addSlider(this, 'audioSmoothing', 'range', { label: 'smoothing', onChange: () => { that.onAudioChange(); } })
		.addSlider(this, 'audioPeakDecay', 'rangeDecay', { label: 'peak decay', dp: 3, onChange: () => { that.onAudioChange(); } })
		.addSlider(this, 'audioPeakInterval', 'rangeInterval', { label: 'peak interval', onChange: () => { that.onAudioChange(); } })
		.addSlider(this, 'audioPeakCutOff', 'range', { label: 'peak cutoff', onChange: () => { that.onAudioChange(); } })
		.addSlider(this, 'audioPeakDetectIndex', 'rangeDetect', { label: 'peak index', step: 1, dp: 0, onChange: () => { that.onAudioChange(); } })
		// .addCanvas({ label: 'wave', height: 60 })

		// .addCheckbox(this, 'camStoryboard', { label: 'storyboard', onChange: () => { that.onCameraChange(); } })
	}

	initStats() {
		this.stats = new Stats();
		document.body.appendChild(this.stats.dom);
	}

	initAudioBars() {
		// hack to get canvas component
		const canvasComponent = this.controlKit._panels[0]._groups[0]._components[1];
		const canvas = canvasComponent.getCanvas();

		this.audioBars = new UIAudioBars(canvas);
	}

	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------

	draw() {
		if (!this.controlKit._enabled) return;
		this.audioBars.draw();
	}

	toggle() {
		if (this.controlKit._enabled) this.controlKit.disable();
		else this.controlKit.enable();
	}

	// ---------------------------------------------------------------------------------------------
	// EVENT HANDLERS
	// ---------------------------------------------------------------------------------------------

	onAudioChange() {
		this.audio.analyserNode.smoothingTimeConstant = this.audioSmoothing;
		this.audio.peakDecay = this.audioPeakDecay;
		this.audio.peakInterval = this.audioPeakInterval;
		this.audio.peakCutOff = this.audioPeakCutOff;
		this.audio.peakDetectIndex = floor(this.audioPeakDetectIndex);
	}
	
	onAudioDistributionChange(index) {
		this.audioDistribution = index || 0;
		this.audio.levelsDistribution = index || 0;
	}
}
