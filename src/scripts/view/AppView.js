import * as THREE from 'three';
import TweenMax from 'gsap';
import Sketch from 'sketch-js';

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
			// this.ui.stats.begin();
			this.webgl.update();
		};

		this.sketch.draw = () => {
			this.webgl.draw();
			// this.ui.stats.end();
		};

		this.sketch.resize = () => {
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
		// move canvas to container
		document.querySelector('#container').appendChild(this.renderer.domElement);
		
		this.webgl = new WebGLView(this);
	}

	initUI() {
		this.ui = new UIView(this);
	}
}
