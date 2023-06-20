import DeployConfig from './DeployConfig.js';
import Wikiploy from './Wikiploy.js';

const ployBot = new Wikiploy();
// mock
// ployBot.mock = true;
// ployBot.mockSleep = 5_000;

(async () => {
	const configs = [];
	configs.push(new DeployConfig({
		src: 'test.js',
		dst: 'User:Nux/test-jsbot--test.js',
	}));
	configs.push(new DeployConfig({
		src: 'test.css',
		dst: 'User:Nux/test-jsbot--test.css',
	}));
	await ployBot.deploy(configs);
})().catch(err => {
	console.error(err);
	process.exit(1);
});
