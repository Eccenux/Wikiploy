<?php
namespace Wikiploy;

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

	/**
	 * Check current version.
	 * 
	 * Does a fresh read from JSON.
	 *
	 * @return $versionFromNpm Version in package.json.
	 */
	public function checkMain() {
		$content = file_get_contents('package.json');
		$this->package = json_decode($content, true);
		return $this->package['version'];
	}

	/**
	 * Update test assest with current versions.
	 *
	 * @param string $path Test asset path.
	 */
	public function updateAsset($path) {
		$content = file_get_contents($path);
		$versionInfo = "$1 Wikiploy v{$this->package['version']} with MWN v{$this->versions['mwn']} $2";
		$content = preg_replace('@(/\*##).+(##\*/)@', $versionInfo, $content);
		file_put_contents($path, $content);
	}

	/**
	 * Update a script with version.
	 *
	 * @param string $path I/O path.
	 */
	public function updateScript($path, $vName, $version) {
		$content = file_get_contents($path);
		$content = self::updateScriptContent($input, $vName, $version);
		file_put_contents($path, $content);
	}
	/**
	 * Update input text with named version.
	 * 
	 * @param string $input Input.
	 * @param string $vName Name of the version (added in marker).
	 * @param string $version New version number.
	 */
	public static function updateScriptContent($input, $vName, $version):string {
		// Example:
		// /*version:vName:*/''/*:vName:version*/
		$content = preg_replace_callback(
			'@(/\*version:'.$vName.':\*/)(?:(\')[^\']*\'|(")[^"]*")(/\*:'.$vName.':version\*/)@',
			function ($matches) use ($version) {
				$qt = !empty($matches[2]) ? $matches[2] : $matches[3];
				return $matches[1].$qt.$version.$qt.$matches[4];
			},
			$input
		);
		return $content;
	}
}

// quick debug
// $input = "const version = /*version:main:*/''/*:main:version*/;";
// $expected = "const version = /*version:main:*/'3.0.0'/*:main:version*/;";
// $result = UpdateChecker::updateScriptContent($input, 'main', '3.0.0');
// echo "\n e: $expected";
// echo "\n r: $result";

