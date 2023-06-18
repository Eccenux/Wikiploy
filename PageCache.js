
/**
 * Aggressive resource caching.
 * 
 * Multiple pages should be able to share this cache.
 */
export default class PageCache {
	constructor() {
		this.cache = {};
		this.stats = {
			fromCache: 0,
			direct: 0,
			saved: 0,
		};
		/** Fake max age [s] */
		this.maxAge = 10 * 3600;
	}

	/** Usage info. */
	info() {
		console.log('[PageCache]'
			, 'stats: ' + JSON.stringify(this.stats)
			, 'urls: ' + Object.keys(this.cache).length
		);
	}

	/**
	 * Prepare page (tab) for caching.
	 * 
	 * Note! This should be done before opening a URL (`page.goto`).
	 * 
	 * @param {Page} page 
	 */
	async enable(page) {
		const cache = this.cache;

		// enable requests hijacking (~PWA)
		await page.setRequestInterception(true);
		
		// serve from cache
		page.on('request', async (request) => {
			const url = request.url();
			try {
				if (url in cache) {
					const cached = cache[url];
					const method = request.method();
					// if (cached.expires > Date.now()) {
					if (method === 'GET') {
						this.stats.fromCache++;
						await request.respond(cached);
						return;
					}
					else {
						console.warn('[PageCache]', 'skipped', JSON.stringify({method, url}));
					}
				}
			} catch (error) {
				console.warn('[PageCache]', 'serving cache failed', url, '\n', error);
			}
			this.stats.direct++;
			request.continue();
		});

		// save to cache
		page.on('response', async (response) => {
			const headers = response.headers();
			const url = response.url();
			let cacheit = this.shouldCache(url, headers);
			if (cacheit) {
				if (url in cache) {
					return;
				}

				let buffer;
				try {
					buffer = await response.buffer();
				} catch (error) {
					return;
				}

				// cleanup headers
				delete headers['nel'];
				delete headers['report-to'];
				delete headers['age'];
				delete headers['cache-control'];
				delete headers['set-cookie'];	// this brakes puppeteer
				delete headers['server-timing'];
				delete headers['x-cache'];
				delete headers['x-cache-status'];

				// save
				this.stats.saved++;
				cache[url] = {
					status: response.status(),
					headers,
					body: buffer,
					expires: Date.now() + (this.maxAge * 1000),
				};
			}
		});
	}

	/** 
	 * Check if we should cache the response.
	 */
	shouldCache(url, headers) {
		const contentType = headers['content-type'] || '';
		if (contentType.startsWith('text/html')) {
			return false;
		}
		if (contentType.search(/^text\/(javascript|css)/i) >= 0) {
			return true;
		}

		const cacheControl = headers['cache-control'] || '';
		if (cacheControl.search(/max-age=[1-9]/) >= 0) {
			return true;
		}

		// user scripts
		if (url.search(/&ctype=text\/(javascript|css)/) >= 0) {
			return true;
		}
		// MediaWiki modules
		if (url.search(/load.+&modules/) >= 0) {
			return true;
		}

		// console.log(JSON.stringify(headers, null, '\t'));
		// console.log(url);

		return null;
	}
}
