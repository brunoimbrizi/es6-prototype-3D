import WebGLView from './webgl/WebGLView';
import UIView from './ui/UIView';

export default class AppView {

	constructor() {
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

		this.initSketch();
	}

	initSketch() {
		this.sketch = Sketch.create({
			type: Sketch.WEBGL,
			element: this.renderer.domElement,
			context: this.renderer.context,
			autopause: false,
			retina: (window.devicePixelRatio >= 2),
			fullscreen: true
		});

		this.sketch.setup = () => {
			this.initWebGL();
			this.initUI();
		};

		this.sketch.update = () => {
			this.webgl.update();
		};

		this.sketch.draw = () => {
			this.webgl.draw();
		};

		this.sketch.resize = () => {
			this.hw = this.sketch.width * 0.5;
			this.hh = this.sketch.height * 0.5;

			this.webgl.resize();
		};

		this.sketch.touchstart = () => {
			const touch = this.sketch.touches[0];
		};

		this.sketch.touchmove = () => {
		};

		this.sketch.touchend = () => {
		};
	}

	initWebGL() {
		this.webgl = new WebGLView(this);
	}

	initUI() {
		this.ui = new UIView(this);
	}
}
