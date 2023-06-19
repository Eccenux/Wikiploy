import DeployConfig from './DeployConfig.js';
import Wikiploy from './Wikiploy.js';

const ployBot = new Wikiploy();
// mock
// ployBot.mock = true;
// ployBot.mockSleep = 5_000;

(async () => {
	const config = new DeployConfig({
		src: 'test.js',
		dst: 'User:Nux/test-jsbot--test.js',
	});
	await ployBot.deploy([config]);
})().catch(err => {
	console.error(err);
	process.exit(1);
});
