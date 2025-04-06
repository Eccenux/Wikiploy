import { Mwn } from 'mwn';

import WikiployBase from './WikiployBase .js';
// eslint-disable-next-line no-unused-vars
import DeployConfig from './DeployConfig.js';

import { promises as fs } from "fs";	// node v11+

const version = /*version:main:*/'2.2.0'/*:main:version*/;

/**
 * MediaWiki deployment automation.
 * 
 * Deploy scripts with the Bot API.
 * https://test.wikipedia.org/wiki/Special:BotPasswords
 */
export default class WikiployLite extends WikiployBase {
	constructor(botpass) {
		super();

		if (typeof botpass != 'object') {
			console.error('Note! Use `botpass` to init config.')
			botpass = {
				username: '__not_provided__',
				password: '__fake__',
			};
		}

		/** [[Special:BotPasswords]] data. */
		this.botpass = {
			username: botpass.username,
			password: botpass.password,
		};
	
		/** @private Bots cache. */
		this._bots = {};
	}

	/**
	 * Deploy with bot password.
	 * @param {DeployConfig[]} configs 
	 */
	async deploy(configs) {
		console.log('[Wikiploy] deploy %d configs (default site: %s)...\n', configs.length, this.site);
		// main loop
		for (const config of configs) {
			await this.save(config);
		}
		console.log(`done`);
	}

	/**
	 * Init/get bot for given config.
	 * @private
	 * @param {DeployConfig} config Config.
	 */
	async getBot(config) {
		const site = this.getSite(config);
		// from cache
		if (site in this._bots) {
			return this._bots[site];
		}
		const apiUrl = `https://${site}/w/api.php`;
		const bot = await Mwn.init({
			apiUrl: apiUrl,
			username: this.botpass.username,
			password: this.botpass.password,
			// UA required for WMF wikis: https://meta.wikimedia.org/wiki/User-Agent_policy
			userAgent: `Wikiploy ${version} ([[:en:Wikipedia:Wikiploy|Wikiploy]])`,
		});
		this._bots[site] = bot;
		return bot;
	}

	/**
	 * Deploy script.
	 * @param {DeployConfig} config Config.
	 */
	async save(config) {
		console.log('[Wikiploy]', config.info());
		const bot = await this.getBot(config);
		// prepare user
		if (config.needsUser()) {
			await this.prepareUser(config);
		}
		// page
		const pageTitle = config.dst;
		// content of the file
		const contents = this.prepareFile(config, await fs.readFile(config.src, 'utf8'));
		// edit description
		const summary = this.prepareSummary(config);

		// save
		if (!this.mock) {
			await bot.save(pageTitle, contents, summary);
			console.log('saved');
		} else {
			console.warn('mock on "%s", inserting %d bytes, summary: %s', pageTitle, contents.length, summary);
		}
	}

	/**
	 * Prepare user in config.
	 * 
	 * Note! Modifies the config.
	 * 
	 * @param {DeployConfig} config Config.
	 * @private
	 */
	async prepareUser(config) {
		// read
		let userName = this.botpass.username.replace(/@.+/, '');

		// finalize
		let changed = config.setUser(userName);
		return changed;
	}

}