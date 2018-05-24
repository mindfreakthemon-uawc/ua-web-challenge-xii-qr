window['DragEvent'] = window['DragEvent'] || Event;

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/worker.js', {
			scope: '/'
		})
		.then(function (registration) {
			console.log('ServiceWorker registration successful with scope: ', registration.scope);
		})
		.catch(function (err) {
			console.log('ServiceWorker registration failed: ', err);
		});
}


platformBrowserDynamic().bootstrapModule(AppModule);
