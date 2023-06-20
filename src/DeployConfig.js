/**
 * Deployment metadata.
 */
export default class DeployConfig {
	/**
	 * @param {DeployConfig} page Edit page (tab).
	 */
	constructor(options) {
		this.src = options?.src;
		this.dst = options?.dst;
		if (!this.dst) {
			this.dst = `~/${this.src}`;
		}
	}

	/** info */
	info() {
		return `deploy "${this.src}" to "${this.dst}"`;
	}

}
