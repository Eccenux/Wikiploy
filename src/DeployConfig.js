/**
 * Deployment metadata.
 */
export default class DeployConfig {
	/**
	 * @param {DeployConfig} page Edit page (tab).
	 */
	constructor(options) {
		/** Source page. */
		this.src = options?.src;
		/** Destination page. */
		this.dst = options?.dst;
		if (!this.dst) {
			this.dst = `~/${this.src}`;
		}
		if (this.dst.indexOf('~')===0) {
			this._dst = this.dst;
		}
		/** Wiki site (domain). */
		this.site = options?.site;
		if (!this.site || typeof this.site != 'string') {
			this.site = '';
		}
		/** Add nowiki tag around code (false by default). */
		this.nowiki = options?.nowiki;
		/**
		 * Custom summary (per file).
		 * 
		 * This can either be a string or a function.
		 * 
		 * Note that you can also set a global summary (for the whole wikiploy).
		 * Empty summary will fallback to global summary rules.
		 */
		this.summary = options?.summary;
		if (typeof this.summary === 'string' && this.summary.length) {
			this.summary = () => options.summary;
		}
		if (typeof this.summary != 'function') {
			this.summary = false;
		}
	}

	/** Does this config require a user. */
	needsUser() {
		return this._dst ? true : false;
	}
	/** Setup user. */
	setUser(userName) {
		if (this._dst) {
			this.dst = this._dst.replace(/^~/, 'User:' + userName);
			return true;
		}
		return false;
	}

	/** info. */
	info() {
		return `deploy "${this.src}" to "${this.dst}"` + (!this.site.length ? '' :  ` (to ${this.site})`);
	}

}
