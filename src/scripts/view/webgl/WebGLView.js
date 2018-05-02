const glslify = require('glslify');
import * as THREE from 'three';

import Quad from './quad/Quad';

export default class WebGLView {

	constructor(view) {
		this.view = view;
		this.renderer = this.view.renderer;

		this.initThree();
		this.initQuad();
	}

	initThree() {
		// scene
		this.scene = new THREE.Scene();

		// orthographic camera
		this.hw = window.innerWidth * 0.5;
		this.hh = window.innerHeight * 0.5;
		this.camera = new THREE.OrthographicCamera(-this.hw, this.hw, this.hh, -this.hh, -10000, 10000);
		this.camera.position.z = 10;
	}

	initQuad() {
		this.quad = new Quad();
		this.scene.add(this.quad.object3D);
	}

	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------

	update() {
		if (this.controls) this.controls.update();
	}

	draw() {
		this.renderer.render(this.scene, this.camera);
	}

	// ---------------------------------------------------------------------------------------------
	// EVENT HANDLERS
	// ---------------------------------------------------------------------------------------------

	resize() {
		if (!this.renderer) return;

		// orthographic camera
		this.hw = window.innerWidth * 0.5;
		this.hh = window.innerHeight * 0.5;

		this.camera.left = -this.hw;
		this.camera.right = this.hw;
		this.camera.top = this.hh;
		this.camera.bottom = -this.hh;
		this.camera.updateProjectionMatrix();

		this.quad.resize();

		this.renderer.setSize(this.view.sketch.width, this.view.sketch.height);
	}
}
