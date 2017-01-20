export default class UIView {

	constructor(view) {
		this.view = view;

		this.range = [0, 1];

		this.initControlKit();
	}

	initControlKit() {
		const that = this;

		this.controlKit = new ControlKit();
		this.controlKit.addPanel({ width: 300 })

		// .addGroup({label: 'Audio', enable: false })
		// .addSlider(this, 'smoothing', 'range', { onChange: () => { that.onAudioChange(); } })
		// .addCheckbox(this, 'freeCamera', { onChange: () => { that.onThreeChange(); } })
	}
}
