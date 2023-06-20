/* global describe, it */
import { assert } from 'chai';
import DeployConfig from '../src/DeployConfig.js';

describe('DeployConfig', function () {
	
	describe('init', function () {
		it('should set src, dst', function () {
			let config = {
				src: 'test.src.js',
				dst: 'User:Nux/test.dst.js',
			};
			let result = new DeployConfig(config);
			console.log(result);
			assert.equal(result.src, config.src);
			assert.equal(result.dst, config.dst);
			// console.log(new DeployConfig({
			// 	src: 'test.js',
			// }));
		});
		it('should default to home', function () {
			let config = {
				src: 'test.js',
			};
			let expected = '~/test.js';
			let result = new DeployConfig(config);
			console.log(result);
			assert.equal(result.dst, expected);
		});
	});

	describe('setUser', function () {
		it('should set userName', function () {
			let config = {
				src: 'test.js',
			};
			let userName = 'Tester';
			let expected = 'User:Tester/test.js';
			let result = new DeployConfig(config);
			result.setUser(userName);
			console.log(result);
			assert.equal(result.dst, expected);


			result = new DeployConfig({
				src: 'assets/test.js',
				dst: '~/test-jsbot--test.js',
			});
			result.setUser(userName);
			console.log(result);
			assert.isTrue(result.dst.indexOf('~') < 0);
		});
		it('should change user', function () {
			let config = {
				src: 'test.js',
			};
			let userName1 = 'Tester1';
			let userName2 = 'Tester2';
			let expected = 'User:Tester2/test.js';
			let result = new DeployConfig(config);
			result.setUser(userName1);
			console.log(result);
			result.setUser(userName2);
			console.log(result);
			assert.equal(result.dst, expected);
		});
		it('should keep inner tilde', function () {
			let config = {
				src: 'test.js',
				dst: 'Mediawiki/~test.js',
			};
			let userName = 'Tester';
			let result = new DeployConfig(config);
			result.setUser(userName);
			assert.equal(result.dst, config.dst);
		});
	});
});
