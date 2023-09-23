// import DeployConfig from './DeployConfig.js';
// import Wikiploy from './Wikiploy.js';

import { Mwn } from 'mwn';

import * as ver from './version.js';

// https://test.wikipedia.org/wiki/Special:BotPasswords
// Note that username should contain `@`.
import * as botpass from './bot.config.js';

const version = await ver.readVersion('./package.json');


console.log('Test:', version);

// auth
const bot = await Mwn.init({
	apiUrl: 'https://pl.wikipedia.org/w/api.php',
	username: botpass.username,
	password: botpass.password,
	// UA required for WMF wikis: https://meta.wikimedia.org/wiki/User-Agent_policy
	userAgent: `Wikiploy ${version} ([[:en:Wikipedia:Wikiploy|Wikiploy]])`,
});

/**
 * Mwn info:
 * https://mwn.toolforge.org/docs/editing-pages
 * (note that docs seem a bit outdated)
 * 
 * bot.save() tests:
 * <li>Works for editing and creating pages.
 * <li>Ignores empty edit.
 */
const pageTitle = 'Wikipedysta:Nux/test-mwnapi--test.js';
const content = 'yadda(xy);';
const summary = `Test ([[:en:Wikipedia:Wikiploy|Wikiploy]] ${version})`;
await bot.save(pageTitle, content, summary);

console.log('Done:', version);