import ControlKit from '@brunoimbrizi/controlkit';
import Stats from 'stats.js';

export default class UIView {

	constructor(view) {
		this.view = view;

		this.range = [0, 1];

		this.initControlKit();
		// this.initStats();
	}

	initControlKit() {
		const that = this;

		this.controlKit = new ControlKit();
		this.controlKit.addPanel({ width: 300, enable: false })

		.addGroup({label: 'Camera', enable: true })
		// .addSlider(this, 'camX', 'rangeCam', { label: 'x', onChange: () => { that.onCameraChange(); } })
		// .addCheckbox(this, 'camStoryboard', { label: 'storyboard', onChange: () => { that.onCameraChange(); } })
	}

	initStats() {
		this.stats = new Stats();

		document.body.appendChild(this.stats.dom);
	}
}
