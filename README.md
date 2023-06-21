Wikiploy
==========================

## Polski opis

[Wikipedia:Wikiploy](https://pl.wikipedia.org/wiki/Wikipedia:Wikiploy)

## English description

User scripts and gadgets deployment for wikis (Wikipedia or more generally MediaWiki based wiki).
Rollout your JS, CSS etc from your git repository to as many MW wikis as you need.

This is using [Puppeteer](https://pptr.dev/) to control [Chrome Canary](https://www.google.com/chrome/canary/). You just open Chrome and run a script. The idea is that you are logged in in Chrome and so all edits are still your edits. You can keep the Canary running in the background when you are changing and deploying more stuff.

## Basic script and dst
```js
import {DeployConfig, Wikiploy} from 'wikiploy';

const ployBot = new Wikiploy();

// run asynchronusly to be able to wait for results
(async () => {
	const configs = [];
	configs.push(new DeployConfig({
		src: 'test.js',
		dst: '~/test-wikiploy--test.js',
	}));
	await ployBot.deploy(configs);
})().catch(err => {
	console.error(err);
	process.exit(1);
});
```

Note that `~` will be `User:SomeName` so the user space of currenlty logged in user.
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
* [Wikiploy on pl.wiki](https://pl.wikipedia.org/wiki/Wikipedia:Wikiploy)
