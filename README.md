Wikiploy
==========================

## Polski opis

[Wikipedia:Wikiploy](https://pl.wikipedia.org/wiki/Wikipedia:Wikiploy)

## English description

User scripts and gadgets deployment for wikis (Wikipedia or more generally MediaWiki based wiki).
Roll-out your JS, CSS etc from your git repository to as many MW wikis as you need.

## New options

### nowiki (v1.7)

Note! It is recommended that you use `nowiki: true` for all JS files. The `nowiki` property is a new option in `DeployConfig` since Wikiploy v1.7.

JavaScript page is still a wiki page... Kind of. It can be added to a category or link to other pages. To avoid this use the nowiki option.

Don't add this option to CSS though. It won't work correctly.

### Wikiploy full (deprecated)

This is using [Puppeteer](https://pptr.dev/) to control [Chrome Canary](https://www.google.com/chrome/canary/) or similar. You just open Chrome with remote debug enabled and run a script. The idea is that you are logged in in Chrome and so all edits are still your edits. You can keep the Canary running in the background when you are changing and deploying more stuff. 

Wikiploy will also work with other Chromium based browser. [Instructions for enabling remote debug in MS Edge](https://learn.microsoft.com/en-us/microsoft-edge/devtools-protocol-chromium/).
Note that to completely close Edge you might need use settings: Continue running in background when Microsoft Edge is closed (pl. *Kontynuuj działanie aplikacji i rozszerzeń w tle po zamknięciu przeglądarki Microsoft Edge*).

### WikiployLite (recommended)

The `WikiployLite` class is using a bot API to deploy scripts. You can use standard `Wikiploy` and `WikiployLite` interchangeably. The `DeployConfig` is the same. WikiployLite is recommended as long as you can use it.

**WikiployLite** is less memory heavy as it doesn't use a browser (and doesn't use `Puppeteer`). You do need to setup a bot password though (on [[Special:BotPasswords]]). It's not as hard as it might seem as you can do this on any Wikimedia wiki and it will work for all WMF wikis. You don't need a bot account for this to work.

Botpass configuration:
* Setup on e.g.: https://test.wikipedia.org/wiki/Special:BotPasswords
* Rights you should setup (if you can): `assets\Bot passwords - Test Wikipedia.png`.
* Example config file in: `assets\bot.config.public.js`.

**Warning!** Never, ever publish your bot password. If you do spill your password, reset/remove the password ASAP (on Special:BotPasswords).

Example `.gitignore` for your project:
```
/node_modules
*.lnk
*.priv.*
bot.config.js
``` 

## Basic script and dst
```js
import {DeployConfig, WikiployLite, userPrompt} from 'wikiploy';

import * as botpass from './bot.config.js';
const ployBot = new WikiployLite(botpass);

// default site for DeployConfig
ployBot.site = "en.wikipedia.org";

// run asynchronously to be able to wait for results
(async () => {
	// Note! The `userPrompt` requires an interactive terminal.
	// In VSC you can use tasks to get an interactive terminal and still run wikiploy from your commandbar.
	const summary = await userPrompt('Summary of changes (empty for default summary):');
	if (typeof summary === 'string' && summary.length) {
		ployBot.summary = () => {
			return summary;
		}
	}

	// push out file(s) to wiki
	const configs = [];
	configs.push(new DeployConfig({
		src: 'test.js',
		dst: '~/test-wikiploy--test.js',
		nowiki: true,
	}));
	await ployBot.deploy(configs);
})().catch(err => {
	console.error(err);
	process.exit(1);
});
```

Note that `~` will be `User:SomeName` so the user space of a currently logged in user (you user space).
You can omit `dst` and it will default to `dst: '~/${src}'`.

More about this basic code and `dst` in the [Wikiploy rollout example](https://github.com/Eccenux/wikiploy-rollout-example/).

## Different wiki sites
Wikiploy defaults to deployments on `pl.wikipedia.org`.

You can change the default like so:
```js
ployBot.site = "en.wikipedia.org"; 
```

You can also set a site for an indvidual `DeployConfig` like so:
```js
configs.push(new DeployConfig({
	src: 'test.js',
	site: "de.wikipedia.org",
}));
```


## External links
* [Wikiploy rollout example (repo)](https://github.com/Eccenux/wikiploy-rollout-example/)
* [Wikiploy on npm](https://www.npmjs.com/package/wikiploy)
* [Wikiploy on en.wiki](https://en.wikipedia.org/wiki/Wikipedia:Wikiploy)
* [Wikiploy on pl.wiki](https://pl.wikipedia.org/wiki/Wikipedia:Wikiploy)
