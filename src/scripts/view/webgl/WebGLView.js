const glslify = require('glslify');

import Quad from './quad/Quad';

export default class WebGLView {

	constructor(view) {
		this.view = view;
		this.renderer = this.view.renderer;

		this.initThree();
		// this.initControls();
		// this.initObject();
		this.initQuad();
	}

	initThree() {
		// scene
		this.scene = new THREE.Scene();

		// perspective camera
		// this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
		// this.camera.position.z = 300;

		// orthographic camera
		this.hw = window.innerWidth * 0.5;
		this.hh = window.innerHeight * 0.5;
		this.camera = new THREE.OrthographicCamera(-this.hw, this.hw, this.hh, -this.hh, -10000, 10000);
		this.camera.position.z = 10;
	}

	initControls() {
		this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);
		this.controls.target.set(0, 0, 0);
		this.controls.rotateSpeed = 2.0;
		this.controls.zoomSpeed = 0.8;
		this.controls.panSpeed = 0.8;
		this.controls.noZoom = false;
		this.controls.noPan = false;
		this.controls.staticMoving = false;
		this.controls.dynamicDampingFactor = 0.15;
		this.controls.maxDistance = 3000;
		this.controls.enabled = true;
	}

	initObject() {
		const geometry = new THREE.BoxGeometry(200, 200, 200);
		// const geometry = new THREE.PlaneGeometry(400, 400, 20, 20);

		const material = new THREE.ShaderMaterial({
			uniforms: {},
			vertexShader: glslify('../../../shaders/default.vert'),
			fragmentShader: glslify('../../../shaders/default.frag'),
			wireframe: true
		});

		const mesh = new THREE.Mesh(geometry, material);
		this.scene.add(mesh);
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
		// perspective camera
		// this.camera.aspect = this.view.sketch.width / this.view.sketch.height;
		// this.camera.updateProjectionMatrix();

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
