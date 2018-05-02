import AsyncPreloader from 'async-preloader';

import AppAudio from './audio/AppAudio';
import AppView from './view/AppView';

export default class App {

	constructor() {
		this.initLoader();
	}

	initLoader() {
		AsyncPreloader.loadManifest('data/manifest.json')
		.then(items => {
			this.initAudio();
			this.initView();
		})
		.catch(err => {
			console.log('AsyncPreloader error', err);
		});
	}

	initAudio() {
		this.audio = new AppAudio();

		// play loaded track
		this.audio.decode(AsyncPreloader.items.get('track'), () => {
			this.audio.play();
		})
	}

	initView() {
		this.view = new AppView();
		this.view.audio = this.audio;
	}
}
