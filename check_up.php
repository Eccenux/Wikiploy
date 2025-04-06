<?php
namespace Wikiploy;

/**
 * Automated check for updates.
 */
require_once "./check/UpdateChecker.php";
require_once "./check/runner.php";

runner('git pull', -1);

$options = getopt("", ["force"]);

$upChecker = new UpdateChecker();

// update package version
$packageVersion = $upChecker->checkMain();
$upChecker->updateScript("./src/WikiployLite.js", "main", $packageVersion);

// check and update internals
// $upChecker->checkPackage("puppeteer");
$upChecker->checkPackage("mwn");
// save
if (!isset($options['force']) && !$upChecker->hasChanges) {
	echo "\n[INFO] No updates for main deps.\n";
} else {
	$upChecker->save();

	echo "\n[INFO] Bump version\n";
	runner('npm run bump');

	$packageVersion = $upChecker->checkMain(); // check and update internals
	echo "\n[INFO] New version: $packageVersion\n";
	// re-update package version
	$upChecker->updateScript("./src/WikiployLite.js", "main", $packageVersion);
	// update test.js/css (puppeteer/mwn version)
	echo "\n[INFO] Update version in assets\n";
	$upChecker->updateAsset('assets/test.css');
	$upChecker->updateAsset('assets/test.js');

	echo "\n[INFO] Update packages and locks\n";
	runner('npm up');
	echo "\n[INFO] Test\n";
	runner('npm test', 3);
}
