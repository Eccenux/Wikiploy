/* global describe, it */
import { assert } from 'chai';
import { default as Wikiploy } from '../src/WikiployLite.js';
import DeployConfig from '../src/DeployConfig.js';

/** Fake bot auth. */
const botpass = {
	username: 'test',
	password: 'mock',
}

describe('Wikiploy', function () {
	
	describe('summary', function () {
		let tag = '• [[en:WP:Wikiploy|Wikiploy]]';
		function prepareSummary(ployBot, configDef) {
			const config = new DeployConfig(configDef);
			console.log({config, summary:config.summary?config.summary():'NN'});
			let summary = ployBot.prepareSummary(config);
			return summary;
		}

		it('should use config string', function () {
			let version = 'v1.1';
			let expected = version + ' ' + tag;
			const ployBot = new Wikiploy(botpass);
			const summary = prepareSummary(ployBot, {
				src: 'test.js',
				summary: version,
			});
			assert.equal(summary, expected);
		});
		it('should use config function', function () {
			let version = 'v1.2';
			let expected = version + ' ' + tag;
			const ployBot = new Wikiploy(botpass);
			const summary = prepareSummary(ployBot, {
				src: 'test.js',
				summary: () => version,
			});
			assert.equal(summary, expected);
		});
		it('should use global function', function () {
			let version = 'v1.3';
			let expected = version + ' ' + tag;
			const ployBot = new Wikiploy(botpass);
			ployBot.summary = () => version;
			const summary = prepareSummary(ployBot, {
				src: 'test.js',
			});
			assert.equal(summary, expected);
		});
	});

	describe('prepareFile', function () {
		const ployBot = new Wikiploy(botpass);
		function prepareFile(contents, configDef) {
			const config = new DeployConfig(configDef);
			let result = ployBot.prepareFile(config, contents);
			return result;
		}

		it('should default to no change', function () {
			let file = 'abc def';
			let expected = file;
			const result = prepareFile(file, {
				src: 'test.js',
			});
			assert.equal(result, expected);
		});
		it('should add nowiki to js', function () {
			let file = 'abc def';
			let expected = '// <nowiki>\nabc def\n// </nowiki>';
			const result = prepareFile(file, {
				src: 'test.js',
				nowiki: true,
			});
			assert.equal(result, expected);
		});
	});
});
