<?php
/**
 * Automated check for updates.
 */
require_once "./check/UpdateChecker.php";
require_once "./check/runner.php";

runner('git pull', -1);

$options = getopt("", ["force"]);

$versionChecker = new UpdateChecker();
// check and update internals
// $versionChecker->checkPackage("puppeteer");
$versionChecker->checkPackage("mwn");
// save
if (!isset($options['force']) && !$versionChecker->hasChanges) {
	echo "\n[INFO] No updates for main deps.\n";
} else {
	$versionChecker->save();

	echo "\n[INFO] Bump version\n";
	runner('npm run bump');

	$packageVersion = $versionChecker->checkMain(); // check and update internals
	echo "\n[INFO] New version: $packageVersion\n";
	// update test.js/css (puppeteer/mwn version)
	echo "\n[INFO] Update version in assets\n";
	$versionChecker->updateAsset('assets/test.css');
	$versionChecker->updateAsset('assets/test.js');

	echo "\n[INFO] Update packages and locks\n";
	runner('npm up');
	echo "\n[INFO] Test\n";
	runner('npm test', 3);
}