<?php
/**
 * Check for updates.
 */
class UpdateChecker {
	private $nodeLocks;
	private $package;
	private $cacheNpm;
	public $hasChanges = false;
	/** modified/checked versions */
	public $versions = array();

	public function __construct() {
		// Read and decode package-lock.json
		$content = file_get_contents('package-lock.json');
		$this->nodeLocks = json_decode($content, true);
		$content = file_get_contents('package.json');
		$this->package = json_decode($content, true);

	}

	/** Get latest version from npm site (cached). */
	private function getNpmVersion($package) {
		if (empty($this->cacheNpm[$package])) {
			$version = exec("npm view $package version");
			$this->cacheNpm[$package] = trim($version);
		}
		return $this->cacheNpm[$package];
	}

	/**
	 * Check package version.
	 *
	 * @param [type] $package
	 * @return $versionFromNpm when updated.
	 */
	public function checkPackage($package) {
		if (!isset($this->nodeLocks['packages']['node_modules/'.$package]['version'])) {
			echo "[ERROR] Package $package not found in package-lock.json.\n";
			// throw new Exception("Unexpected: All packages should be there");
			return -1;
		}

		// Get version from package-lock.json
		$versionFromLock = $this->nodeLocks['packages']['node_modules/'.$package]['version'];
		$this->versions[$package] = $versionFromLock;

		// Get version from npm site
		$versionFromNpm = $this->getNpmVersion($package);

		if ($versionFromLock === $versionFromNpm) {
			echo "[INFO] Versions match for $package (no updates).\n";
			return true;
		} else {
			echo "[INFO] Versions differ for $package: $versionFromLock -> $versionFromNpm\n";
			$this->package['dependencies'][$package] = preg_replace("#[0-9]+$#", "x", $versionFromNpm);
			$this->versions[$package] = $versionFromNpm;
			$this->hasChanges = true;
			return $versionFromNpm;
		}
	}

	/** Update */
	public function save() {
		if ($this->hasChanges) {
			echo "[INFO] Saving changes.\n";
			$data = json_encode($this->package, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
			file_put_contents('package.json', $data);
		}
	}

	public function updateAsset($path) {
		$content = file_get_contents($path);
		$versionInfo = "/* puppeteer {$this->versions['puppeteer']} xor mwn {$this->versions['mwn']} */";
		$content = preg_replace('#/\* puppeteer [0-9.x]+ \w+ mwn [0-9.x]+ \*/#', $versionInfo, $content);
		file_put_contents($path, $content);
	}
}
