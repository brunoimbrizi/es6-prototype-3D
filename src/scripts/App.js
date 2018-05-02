import AsyncPreloader from 'async-preloader';

import AppView from './view/AppView';

export default class App {

	constructor() {
		this.initLoader();
	}

	initLoader() {
		AsyncPreloader.loadManifest('data/manifest.json')
		.then(items => {
			this.initView();
		})
		.catch(err => {
			console.log('AsyncPreloader error', err);
		});
	}

	initView() {
		this.view = new AppView();
	}
}
