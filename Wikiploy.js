/* global document, console, process */
import puppeteer, { Browser, Page } from 'puppeteer'; // v13.0.0 or later

import WikiBot from './WikiBot.js';
import PageCache from './PageCache.js';

import {
	wsBrowserPort,
} from './chrome.config.js'

function sleep(sleepMs) {
	return new Promise((resolve)=>{setTimeout(()=>resolve(), sleepMs)});
}

/**
 * MediaWiki deployment automation.
 */
export default class Wikiploy {
	constructor() {
		this.cache = new PageCache();
		/** Disable save. */
		this.mock = false;
		/** Wait before close [ms] (or you can set a breakpoint to check stuff). */
		this.mockSleep = 0;

		/** Browser connection. */
		this._browser = false;

		/** Bot helper. */
		this._bot = new WikiBot(this.cache);
	}

	/**
	 * Deploy scripts.
	 * @param {Array} configs 
	 */
	async deploy(configs) {
		const browser = this.init();
		console.log(`done`);
		process.exit(0);
	}

	/**
	 * Prepare edit URL.
	 * 
	 * @param {String} pageTitle Title with namespace.
	 * @returns {String} Full edit URL.
	 * @private
	 */
	editUrl(pageTitle) {
		const baseUrl = `https://pl.wikipedia.org/w/index.php`;	// TODO: config/options

		// common params
		// note that submit action is not affected by new wikicode editor
		let params = `
			&useskin=monobook
			&action=submit
		`.replace(/\s+/g, '');

		return baseUrl + '?title=' + encodeURIComponent(pageTitle) + params;
	}
	
	/** @private Init browser connection. */
	async init() {
		if (this._browser) {
			return this._browser;
		}

		// connect to current (open) Chrome window
		const browserURL = `http://127.0.0.1:${wsBrowserPort}`;
		const browser = await puppeteer.connect({
			// browserWSEndpoint: wsUrl,
			browserURL,
		});

		return browser;
	}
}