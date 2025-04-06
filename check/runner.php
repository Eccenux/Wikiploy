<?php
namespace Wikiploy;

/**
 * Simple executioner.
 *
 * @param string $command
 * @param integer $tail
 * @return void
 */
function runner($command, $tail=10) {
	exec($command, $output, $retval);
	if ($retval !== 0) {
		echo "[ERROR] Failed to run command ($command) (returned with status $retval)\n";
	} else {
		echo "[INFO] Command ($command) seems OK\n";
	}
	if ($tail > 0) {
		$output = array_slice($output, -$tail);
	}
	foreach($output as $line) {
		echo $line;
		echo "\n";
	}
	echo "\n";
}