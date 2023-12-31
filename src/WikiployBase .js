// eslint-disable-next-line no-unused-vars
import DeployConfig from './DeployConfig.js';

/**
 * Generic Wikiploy.
 */
export default class WikiployBase {
	constructor() {
		/** Disable save. */
		this.mock = false;
		/** Default wiki site (domain). */
		this.site = 'pl.wikipedia.org';
	}

	/**
	 * Deploy many...
	 * @param {DeployConfig[]} configs 
	 */
	async deploy(configs) {
		console.log(`done %d`, configs.length);
		throw 'Not implemented';
	}

	/**
	 * Prepare edit summary.
	 * 
	 * @param {DeployConfig} config Config.
	 * @returns {String} Edit summary.
	 * @private
	 */
	prepareSummary(config) {
		let summary = typeof config.summary === 'function' ? config.summary() : this.summary(config);
		return `${summary} • [[en:WP:Wikiploy|Wikiploy]]`;
	}

	/**
	 * Prepare a text file for wiki.
	 * 
	 * @param {DeployConfig} config Config.
	 * @param {String} contents Text file.
	 * @returns {String} Edit summary.
	 * @private
	 */
	prepareFile(config, contents) {
		if (config.nowiki) {
			// if (config.src.search(/\.js$/) > 0) {
			// }
			contents = '// <nowiki>\n' + contents + '\n// </nowiki>';
		}
		
		return contents;
	}

	/** @private Get site for a config. */
	getSite(config) {
		let site = config.site.length ? config.site : this.site;
		return site;
	}

	/**
	 * Custom summary.
	 * 
	 * This can be e.g. version number and short, text summary.
	 * You can use config to add e.g. file name too (which is default).
	 * 
	 * @param {DeployConfig} config Deployment configuration object.
	 * @returns {String} Summary added to saved edits.
	 */
	summary(config) {
		return config.src;
	}
}