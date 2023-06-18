/* global describe, it */
import { assert } from 'chai';
import DeployConfig from '../DeployConfig.js';

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
});
