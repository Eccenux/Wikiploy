Wikiploy
==========================

Wikiploy is a one-click solution to deploy JS and CSS to Wikipedia. It uses NodeJS version 14 or higher.

After the initial setup, you can quickly build and deploy your user scripts and gadgets. Though this was designed to work with Wikipedia, you should be able to deploy to any [MediaWiki](https://www.mediawiki.org/)-based wiki. You can even deploy to multiple websites with just one click on your commandbar. Your only limitation is your access level to the wikis.

## Table of contents
<!-- TOC depthfrom:2 updateonsave:false -->

- [Table of contents](#table-of-contents)
- [See also](#see-also)
- [New capabilities](#new-capabilities)
	- [setupSummary v2.1](#setupsummary-v21)
		- [Parameters](#parameters)
		- [Usage](#usage)
	- [Lightweight Dependencies v2.0](#lightweight-dependencies-v20)
	- [userPrompt v1.8](#userprompt-v18)
	- [nowiki v1.7](#nowiki-v17)
- [Using Wikiploy](#using-wikiploy)
- [Botpass configuration](#botpass-configuration)
- [Different wiki sites](#different-wiki-sites)
- [External links](#external-links)

<!-- /TOC -->

## See also

- [Wikiploy project template](https://github.com/Eccenux/wikiploy-rollout-example/releases) — quick start for you gadgets.
- [README: building your project](https://github.com/Eccenux/Wikiploy/blob/main/README.building%20your%20project.md) — recommendation on how to build JS and CSS for your gadgets (includes unit testing setup).
- [Wikipedia:Wikiploy on pl.wiki](https://pl.wikipedia.org/wiki/Wikipedia:Wikiploy) — Polish description.
- (more links on the bottom)

## New capabilities

### setupSummary (v2.1)

A helper function that can replace your usages of `userPrompt`. It prompts a user running wikiploy for a summary of changes.
It can optionally add a version number to the full summary of your edits (deploy-edits).

#### Parameters

The `setupSummary` function requires a `Wikiploy` bot object and optionally takes a gadget version and a standard summary text.

- `ployBot`: A `Wikiploy` bot object. This is required to setup the `summary()` function.
- `version` (optional): The version of your gadget. Defaults to an empty string if not provided.
- `standardSummary` (optional): A string that provides a standard summary (aside from the version). Defaults to "changes from Github".

If your answer to the prompt would be: "fixed bug #123", you would get a full summary: "v5.6.0: fixed bug #123" (v${version}: ${summary}).
For no answer you would get: "v5.6.0: changes from Github".

#### Usage

Basic usage:
```js
// custom summary from a prompt
await setupSummary(ployBot);
```

Version from package:
```js
(async () => {
	// custom summary from a prompt
	let version = await readVersion('package.json');
	await setupSummary(ployBot, version);
	
	// [...]

	await ployBot.deploy(configs);
})().catch(err => {
	console.error(err);
	process.exit(1);
});
```

### Lightweight Dependencies (v2.0)

We had a good run, but it's time to bid farewell to [Puppeteer](https://pptr.dev/) and free the puppets ;). Obviously, this might be a breaking change if you really need to use it. However, the Wikiploy API doesn't really change...

The only change is that you need to provide bot configuration to Wikiploy (as already described for WikiployLite). It's not nothing, but you only need to follow few steps from the [Botpass configuration section](#botpass-configuration). You only need to do it once and then use in all your user scripts.

`WikiployLite` is now synonymous with `Wikiploy`. You can use either of the class names.

### userPrompt (v1.8)

Use the `userPrompt` helper function to prompt for a summary in your Wikiploy script. This is only a helper. You can still set up a static summary, but a prompt helps to ensure you don't forget to change the summary.

Note that when using `userPrompt` you have to use an interactive terminal. This might be a bit more tricky to set up but can still function as a one-click build from a commandbar (see [README: building your project](https://github.com/Eccenux/Wikiploy/blob/main/README.building%20your%20project.md)).

### nowiki (v1.7)

The `nowiki` property is a new option in `DeployConfig` since Wikiploy v1.7. It is now recommended to use `nowiki: true` for all JS files.
```js
	configs.push(new DeployConfig({
		src: 'dist/test.js',
		dst: '~/test.js',
		nowiki: true,
	})); 
```

JavaScript page is still a wiki page... Kind of. It can be added to a category or link to other pages. To avoid this use the nowiki option.

Don't add this option to CSS though. It won't work correctly.

## Using Wikiploy

Either use [Wikiploy project template](https://github.com/Eccenux/wikiploy-rollout-example/releases) or add Wikiploy to your project:
```bash
# npm install wikiploy --save-dev
npm i wikiploy -D
```

The `Wikiploy` class can be used to help deploy scripts. It is using a bot API to do that, but don't worry, you don't need to be a bot ;).

You do need to setup a bot password though (on [[Special:BotPasswords]]). It's not as hard as it might seem as **you can do this on *any* Wikimedia wiki and it will work for *all* WMF wikis**. You don't need a bot account for this to work. You will just create an alias for your standard account and a special password just for your scripts.

## Botpass configuration
A bot password is essentially a sub-account, designed to help keep your activities separated and secure. Setting up a sub-account is straightforward, and nearly anyone can do it.

1. Begin by setting up your sub-account on this page: [test.wikipedia.org/wiki/Special:BotPasswords](https://test.wikipedia.org/wiki/Special:BotPasswords).
2. Choose a name and specify the permissions for your sub-account. For instance, you should grant rights necessary for deploying gadgets (if applicable). You can refer to this example screenshot for setting up rights: [assets\Bot passwords - Test Wikipedia.png](https://github.com/Eccenux/Wikiploy/blob/main/assets/Bot%20passwords%20-%20Test%20Wikipedia.png).
3. Next, create your `bot.config.mjs` file. An example configuration file can be found here: `assets\public--bot.config.mjs`.

**Warning!** Never, ever publish your bot password. If you do spill your password, reset/remove the password ASAP (on [Special:BotPasswords](https://test.wikipedia.org/wiki/Special:BotPasswords)).


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
