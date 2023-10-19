import DeployConfig from './DeployConfig.js';
import Wikiploy from './Wikiploy.js';

const ployBot = new Wikiploy();
// mock
// ployBot.mock = true;
// ployBot.mockSleep = 5_000;

(async () => {
	const configs = [];
	configs.push(new DeployConfig({
		src: 'assets/test.js',
		dst: '~/test-jsbot--test.js',
		nowiki: true,
	}));
	configs.push(new DeployConfig({
		src: 'assets/test.css',
		dst: '~/test-jsbot--test.css',
	}));
	configs.push(new DeployConfig({
		src: 'assets/test.js',
		dst: '~/test-jsbot--test.js',
		site: 'en.wikipedia.org',
		nowiki: true,
	}));
	configs.push(new DeployConfig({
		src: 'assets/test.css',
		dst: '~/test-jsbot--test.css',
		site: 'en.wikipedia.org',
	}));
	await ployBot.deploy(configs);
})().catch(err => {
	console.error(err);
	process.exit(1);
});
