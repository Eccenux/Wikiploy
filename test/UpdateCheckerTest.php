<?php
namespace Wikiploy\Tests;

use PHPUnit\Framework\TestCase;
use Wikiploy\UpdateChecker;

class UpdateCheckerTest extends TestCase {

	/** Basic check of empty string replace. */
	public function testUpdateEmptyVersion() {
		$input = "const version = /*version:main:*/''/*:main:version*/;";
		$expected = "const version = /*version:main:*/'3.0.0'/*:main:version*/;";
		$result = UpdateChecker::updateScriptContent($input, 'main', '3.0.0');
		$this->assertSame($expected, $result);
	}

	/** Preserving other lines of code. */
	public function testUpdateEmptyVersionWithExtraCode() {
		$input = "const version = /*version:main:*/''/*:main:version*/;\nconst def='version:'+version;";
		$expected = "const version = /*version:main:*/'3.0.0'/*:main:version*/;\nconst def='version:'+version;";
		$result = UpdateChecker::updateScriptContent($input, 'main', '3.0.0');
		$this->assertSame($expected, $result);
	}

	/** Replace existing version in single quotes. */
	public function testUpdateExistingSingleQuotedVersion() {
		$input = "const version = /*version:main:*/'1.2.3'/*:main:version*/;";
		$expected = "const version = /*version:main:*/'3.0.0'/*:main:version*/;";
		$result = UpdateChecker::updateScriptContent($input, 'main', '3.0.0');
		$this->assertSame($expected, $result);
	}

	/** Replace existing version in double quotes. */
	public function testUpdateExistingDoubleQuotedVersion() {
		$input = "const version = /*version:main:*/\"2.3\"/*:main:version*/;";
		$expected = "const version = /*version:main:*/\"3.0.0\"/*:main:version*/;";
		$result = UpdateChecker::updateScriptContent($input, 'main', '3.0.0');
		$this->assertSame($expected, $result);
	}

	/** Different marker, many. */
	public function testReplaceByMarkers() {
		$input      = "";
		$input     .= "const version =    /*version:main:*/'     '/*:main:version*/;";
		$input     .= "const version = /*version:kopytko:*/'     '/*:kopytko:version*/;";
		$input     .= "const version =    /*version:main:*/'     '/*:main:version*/;";
		$input     .= "const version = /*version:kopytko:*/'     '/*:kopytko:version*/;";
		$expected   = "";
		$expected  .= "const version =    /*version:main:*/'     '/*:main:version*/;";
		$expected  .= "const version = /*version:kopytko:*/'3.7.9'/*:kopytko:version*/;";
		$expected  .= "const version =    /*version:main:*/'     '/*:main:version*/;";
		$expected  .= "const version = /*version:kopytko:*/'3.7.9'/*:kopytko:version*/;";
		$expected2  = "";
		$expected2 .= "const version =    /*version:main:*/'1.8.4'/*:main:version*/;";
		$expected2 .= "const version = /*version:kopytko:*/'3.7.9'/*:kopytko:version*/;";
		$expected2 .= "const version =    /*version:main:*/'1.8.4'/*:main:version*/;";
		$expected2 .= "const version = /*version:kopytko:*/'3.7.9'/*:kopytko:version*/;";
		$result = UpdateChecker::updateScriptContent($input, 'kopytko', '3.7.9');
		$result2 = UpdateChecker::updateScriptContent($result, 'main', '1.8.4');
		$this->assertSame($expected, $result);
		$this->assertSame($expected2, $result2);
	}

	/** No marker no change. */
	public function testNoVersionMarker() {
		$input = "const version = '1.0.0';";
		$result = UpdateChecker::updateScriptContent($input, 'main', '3.0.0');
		$this->assertSame($input, $result);
	}
}
