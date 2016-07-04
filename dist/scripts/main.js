(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AppView = require('./view/AppView');

var _AppView2 = _interopRequireDefault(_AppView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
  function App(el) {
    _classCallCheck(this, App);

    this.el = el;
    this.listeners = {};

    this.initView();
  }

  _createClass(App, [{
    key: 'initView',
    value: function initView() {
      this.view = new _AppView2.default();
    }
  }, {
    key: 'on',
    value: function on(type, cb) {
      this.listeners[type] = this.listeners[type] || [];
      if (this.listeners[type].indexOf(cb) === -1) {
        this.listeners[type].push(cb);
      }
    }
  }, {
    key: 'off',
    value: function off(type, cb) {
      if (this.listeners[type]) {
        if (cb) {
          var index = this.listeners[type].indexOf(cb);
          if (index !== -1) {
            this.listeners[type].splice(index, 1);
          }
        } else this.listeners[type] = [];
      }
    }
  }, {
    key: 'trigger',
    value: function trigger(type, args) {
      if (this.listeners[type]) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.listeners[type][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var cb = _step.value;

            cb(args);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    }
  }]);

  return App;
}();

exports.default = App;

},{"./view/AppView":4}],2:[function(require,module,exports){
'use strict';

var _App = require('./App');

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ready(fn) {
	if (document.readyState !== 'loading') {
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
}

ready(function () {
	var app = new _App2.default();
	window.app = app;
});

},{"./App":1}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AppThree = function () {
  function AppThree(view) {
    _classCallCheck(this, AppThree);

    this.view = view;
    this.renderer = this.view.renderer;

    this.initThree();
    this.initControls();
    this.initObject();
  }

  _createClass(AppThree, [{
    key: "initThree",
    value: function initThree() {
      // scene
      this.scene = new THREE.Scene();

      // camera
      this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
      this.camera.position.z = 300;
    }
  }, {
    key: "initControls",
    value: function initControls() {
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
  }, {
    key: "initObject",
    value: function initObject() {
      var geometry = new THREE.BoxGeometry(200, 200, 200);
      // const geometry = new THREE.PlaneGeometry(400, 400, 20, 20);
      var material = new THREE.MeshBasicMaterial({ color: 0x444444, wireframe: true });
      var mesh = new THREE.Mesh(geometry, material);
      this.scene.add(mesh);
    }

    // ---------------------------------------------------------------------------------------------
    // PUBLIC
    // ---------------------------------------------------------------------------------------------

  }, {
    key: "update",
    value: function update() {
      this.controls.update();
    }
  }, {
    key: "draw",
    value: function draw() {
      this.renderer.render(this.scene, this.camera);
    }

    // ---------------------------------------------------------------------------------------------
    // EVENT HANDLERS
    // ---------------------------------------------------------------------------------------------

  }, {
    key: "resize",
    value: function resize() {
      if (!this.renderer) return;
      this.camera.aspect = this.view.sketch.width / this.view.sketch.height;
      this.camera.updateProjectionMatrix();;

      this.renderer.setSize(this.view.sketch.width, this.view.sketch.height);

      this.hw = this.view.sketch.width * .5;
      this.hh = this.view.sketch.height * .5;
    }
  }]);

  return AppThree;
}();

exports.default = AppThree;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AppThree = require('./AppThree');

var _AppThree2 = _interopRequireDefault(_AppThree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AppView = function () {
	function AppView() {
		_classCallCheck(this, AppView);

		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

		this.initSketch();
	}

	_createClass(AppView, [{
		key: 'initSketch',
		value: function initSketch() {
			var _this = this;

			this.sketch = Sketch.create({
				type: Sketch.WEBGL,
				element: this.renderer.domElement,
				context: this.renderer.context,
				autopause: false,
				retina: window.devicePixelRatio >= 2,
				fullscreen: true
			});

			this.sketch.setup = function () {
				_this.initThree();
			};

			this.sketch.update = function () {
				_this.three.update();
			};

			this.sketch.draw = function () {
				_this.three.draw();
			};

			this.sketch.resize = function () {
				_this.hw = _this.sketch.width * 0.5;
				_this.hh = _this.sketch.height * 0.5;

				_this.three.resize();
			};

			this.sketch.touchstart = function (e) {
				var touch = _this.sketch.touches[0];
			};

			this.sketch.touchmove = function () {};

			this.sketch.touchend = function () {};
		}
	}, {
		key: 'initThree',
		value: function initThree() {
			this.three = new _AppThree2.default(this);
		}
	}]);

	return AppView;
}();

exports.default = AppView;

},{"./AppThree":3}]},{},[2]);
