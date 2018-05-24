/* ---- */
if (!Cache.prototype.add) {
	Cache.prototype.add = function add(request) {
		return this.addAll([request]);
	};
}

if (!Cache.prototype.addAll) {
	Cache.prototype.addAll = function addAll(requests) {
		var cache = this;

		// Since DOMExceptions are not constructable:
		function NetworkError(message) {
			this.name = 'NetworkError';
			this.code = 19;
			this.message = message;
		}
		NetworkError.prototype = Object.create(Error.prototype);

		return Promise.resolve().then(function() {
			if (arguments.length < 1) throw new TypeError();

			// Simulate sequence<(Request or USVString)> binding:
			var sequence = [];

			requests = requests.map(function(request) {
				if (request instanceof Request) {
					return request;
				}
				else {
					return String(request); // may throw TypeError
				}
			});

			return Promise.all(
				requests.map(function(request) {
					if (typeof request === 'string') {
						request = new Request(request);
					}

					var scheme = new URL(request.url).protocol;

					if (scheme !== 'http:' && scheme !== 'https:') {
						throw new NetworkError("Invalid scheme");
					}

					return fetch(request.clone());
				})
			);
		}).then(function(responses) {
			// TODO: check that requests don't overwrite one another
			// (don't think this is possible to polyfill due to opaque responses)
			return Promise.all(
				responses.map(function(response, i) {
					return cache.put(requests[i], response);
				})
			);
		}).then(function() {
			return undefined;
		});
	};
}
/* ---- */

var CACHE_NAME = 'ua-web-challenge-xii-qr-v1';

var urlsToCache = [];

self.addEventListener('install', function (event) {
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(function (cache) {
				return cache.addAll(urlsToCache);
			})
	);
});

// when update needed
//self.addEventListener('activate', function(event) {
//	var cacheWhitelist = [];
//
//	event.waitUntil(
//		caches.keys().then(function(cacheNames) {
//			return Promise.all(
//				cacheNames.map(function(cacheName) {
//					if (cacheWhitelist.indexOf(cacheName) === -1) {
//						return caches.delete(cacheName);
//					}
//				})
//			);
//		})
//	);
//});

self.addEventListener('fetch', function (event) {
	event.respondWith(
		caches.match(event.request)
			.then(function (response) {
				if (response) {
					return response;
				}

				var fetchRequest = event.request.clone();

				return fetch(fetchRequest).then(
					function (response) {
						// Check if we received a valid response
						if (!response || response.status !== 200 || (response.type !== 'basic' && response.type !== 'cors')) {
							return response;
						}

						var responseToCache = response.clone();

						caches.open(CACHE_NAME)
							.then(function (cache) {
								cache.put(event.request, responseToCache);
							});

						return response;
					}
				);
			})
	);
});
