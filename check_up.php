<?php
/**
 * Automated check for updates.
 */
require_once "./check/UpdateChecker.php";
require_once "./check/runner.php";

runner('git pull', -1);

$versionChecker = new UpdateChecker();
// check and update internals
$versionChecker->checkPackage("puppeteer");
$versionChecker->checkPackage("mwn");
// save
if ($versionChecker->hasChanges) {
	$versionChecker->save();
	// update test.js/css (puppeteer/mwn version)
	$versionChecker->updateAsset('assets/test.css');
	$versionChecker->updateAsset('assets/test.js');

	echo "\n[INFO] Bump version\n";
	runner('npm run bump');
	echo "\n[INFO] Update packages and locks\n";
	runner('npm up');
	echo "\n[INFO] Test\n";
	runner('npm test', 3);
}