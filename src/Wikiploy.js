import puppeteer, { Browser } from 'puppeteer'; // v13+

import WikiployBase from './WikiployBase .js';
import WikiOps from './WikiOps.js';
import PageCache from './PageCache.js';
// eslint-disable-next-line no-unused-vars
import DeployConfig from './DeployConfig.js';

import { promises as fs } from "fs";	// node v11+

import {
	wsBrowserPort,
} from './chrome.config.js'

// eslint-disable-next-line no-unused-vars
function sleep(sleepMs) {
	return new Promise((resolve)=>{setTimeout(()=>resolve(), sleepMs)});
}

/**
 * MediaWiki deployment automation.
 * Deploy scripts with a browser (puppetter).
 * 
 * @property _browser {Browser} Browser connection.
 */
export default class Wikiploy extends WikiployBase {
	constructor() {
		super();

		this.cache = new PageCache();

		/** Wait before close [ms] (or you can set a breakpoint to check stuff). */
		this.mockSleep = 0;

		/** @private Browser connection. */
		this._browser = false;

		/** @private Bot helper. */
		this._bot = new WikiOps(this.cache);

		/** @private Users cache. */
		this._users = {};
	}

	/**
	 * Deploy scripts with a browser (puppetter).
	 * @param {DeployConfig[]} configs 
	 */
	async deploy(configs) {
		console.log('[Wikiploy] deploy %d configs (default site: %s)...\n', configs.length, this.site);

		const bot = this._bot;
		const browser = await this.init();
		const page = await bot.openTab(browser);
		// console.log(JSON.stringify(configs));
		// main loop
		for (const config of configs) {
			await this.save(config, page);
		}
		page.close();
		console.log(`done`);
		process.exit(0);
	}

	/**
	 * Deploy script.
	 * @param {DeployConfig} config Config.
	 * @param {Page} page
	 */
	async save(config, page) {
		console.log('[Wikiploy]', config.info());
		const bot = this._bot;
		// prepare user
		if (config.needsUser()) {
			await this.prepareUser(config, page);
		}
		// navigate
		let url = this.editUrl(config.dst, config);
		await bot.goto(page, url);
		// insert the content of the file into the edit field
		const contents = this.prepareFile(config, await fs.readFile(config.src, 'utf8'));
		await bot.fillEdit(page, contents);
		// edit description
		const summary = this.prepareSummary(config);
		await bot.fillSummary(page, summary);

		// save
		if (!this.mock) {
			await bot.saveEdit(page);
			console.log('saved');
		} else {
			await sleep(this.mockSleep);
		}
	}

	/**
	 * Prepare user in config.
	 * 
	 * Note! Modifies the config.
	 * 
	 * @param {DeployConfig} config Config.
	 * @param {Page} page
	 * @private
	 */
	async prepareUser(config, page) {
		const bot = this._bot;

		const site = this.getSite(config);
		// from cache
		if (site in this._users) {
			let changed = config.setUser(this._users[site]);
			return changed;
		}

		// any page
		let url = this.liteUrl(config);
		await bot.goto(page, url, true);

		// read
		let userName = await bot.readUser(page);
		if (!userName) {
			throw 'Unable to read user name. Not authenticated?';
		}

		// save to cache
		this._users[site] = userName;

		// finalize
		let changed = config.setUser(userName);
		return changed;
	}

	/**
	 * Prepare base URL.
	 * 
	 * @param {DeployConfig} config Configuration.
	 * @returns {String} Base URL.
	 * @private
	 */
	baseUrl(config) {
		const site = this.getSite(config);
		const origin = `https://${site}`;
		const baseUrl = `${origin}/w/index.php`;
		return baseUrl;
	}

	/**
	 * Prepare edit URL.
	 * 
	 * @param {String} pageTitle Title with namespace.
	 * @param {DeployConfig} config Configuration.
	 * @returns {String} Full edit URL.
	 * @private
	 */
	editUrl(pageTitle, config) {
		const baseUrl = this.baseUrl(config);

		// common params
		// note that submit action is not affected by new wikicode editor
		let params = `
			&useskin=monobook
			&action=submit
		`.replace(/\s+/g, '');

		return baseUrl + '?title=' + encodeURIComponent(pageTitle) + params;
	}
	
	/**
	 * Prepare URL of some lite page.
	 * 
	 * @param {DeployConfig} config Configuration.
	 * @returns {String} URL within Wiki.
	 * @private
	 */
	liteUrl(config) {
		const baseUrl = this.baseUrl(config);

		// common params
		// note that submit action is not affected by new wikicode editor
		let params = `
			&useskin=monobook
		`.replace(/\s+/g, '');

		return baseUrl + '?title=User:Nux/blank.js' + params;
	}

	/**
	 * Init browser connection.
	 * 
	 * @returns {Browser} the browser API.
	 */
	async init() {
		if (this._browser instanceof Browser) {
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