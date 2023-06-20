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
		/** Wiki site (domain). */
		this.site = options?.site;
		if (!this.site || typeof this.site != 'string') {
			this.site = '';
		}
	}

	/** info. */
	info() {
		return `deploy "${this.src}" to "${this.dst}"`;
	}

}
