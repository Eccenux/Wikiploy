import DeployConfig from './DeployConfig.js';
import WikiployLite from './WikiployLite.js';

// https://test.wikipedia.org/wiki/Special:BotPasswords
// Note that username should contain `@`.
import * as botpass from './bot.config.js';

const ployBot = new WikiployLite(botpass);
// mock
// ployBot.mock = true;
// ployBot.mockSleep = 5_000;

(async () => {
	const configs = [];
	configs.push(new DeployConfig({
		src: 'assets/test.js',
		dst: '~/test-wikiploylite--test.js',
	}));
	configs.push(new DeployConfig({
		src: 'assets/test.js',
		dst: '~/test-wikiploylite--test.js',
		site: 'en.wikipedia.org',
	}));
	configs.push(new DeployConfig({
		src: 'assets/test.css',
		dst: '~/test-wikiploylite--test.css',
	}));
	configs.push(new DeployConfig({
		src: 'assets/test.css',
		dst: '~/test-wikiploylite--test.css',
		site: 'en.wikipedia.org',
	}));
	await ployBot.deploy(configs);

	// check bots
	let bots = Object.keys(ployBot._bots);
	console.log('Bots: %d', bots.length, bots);
})().catch(err => {
	console.error(err);
	process.exit(1);
});
