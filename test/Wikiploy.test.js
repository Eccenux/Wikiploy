/* global describe, it */
import { assert } from 'chai';
import Wikiploy from '../src/Wikiploy.js';
import DeployConfig from '../src/DeployConfig.js';

describe('Wikiploy', function () {
	
	describe('summary', function () {
		let tag = '#Wikiploy';
		function prepareSummary(ployBot, configDef) {
			const config = new DeployConfig(configDef);
			console.log({config, summary:config.summary?config.summary():'NN'});
			let summary = ployBot.prepareSummary(config);
			return summary;
		}

		it('should use config string', function () {
			let version = 'v1.1';
			let expected = tag + ' ' + version;
			const ployBot = new Wikiploy();
			const summary = prepareSummary(ployBot, {
				src: 'test.js',
				summary: version,
			});
			assert.equal(summary, expected);
		});
		it('should use config function', function () {
			let version = 'v1.2';
			let expected = tag + ' ' + version;
			const ployBot = new Wikiploy();
			const summary = prepareSummary(ployBot, {
				src: 'test.js',
				summary: () => version,
			});
			assert.equal(summary, expected);
		});
		it('should use global function', function () {
			let version = 'v1.3';
			let expected = tag + ' ' + version;
			const ployBot = new Wikiploy();
			ployBot.summary = () => version;
			const summary = prepareSummary(ployBot, {
				src: 'test.js',
			});
			assert.equal(summary, expected);
		});
	});
});
