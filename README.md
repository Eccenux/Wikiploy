Wikiploy
==========================

Wikiploy is a one-click solution to deploy JS and CSS to Wikipedia.

After the initial setup, you can quickly build and deploy your user scripts and gadgets. Though this was designed to work with Wikipedia, you should be able to deploy to any [MediaWiki](https://www.mediawiki.org/)-based wiki. You can even deploy to multiple websites with just one click on your commandbar. Your only limitation is your access level to the wikis.

See also:

- [README: building your project](https://github.com/Eccenux/Wikiploy/blob/main/README.building%20your%20project.md) recommendation on how to build JS and CSS for your gadgets (includes unit testing setup).
- [Wikipedia:Wikiploy on pl.wiki](https://pl.wikipedia.org/wiki/Wikipedia:Wikiploy) for Polish description.
- (more links on the bottom)

## The last puppeteer

Version 1.9 is probably going to be the last with the [puppeteer](https://pptr.dev/). The amout of changes in this library and amount of dependencies just doesn't cut it. It is just too heavy for this project.

I might update v1.9 branch or release a separate Wikiploy, but I don't know if there would be any interest.

## New capabilities

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

### userPrompt (v1.8)

Use the `userPrompt` helper function to prompt for a summary in your Wikiploy script. This is only a helper. You can still set up a static summary, but a prompt helps to ensure you don't forget to change the summary.

Note that when using `userPrompt` you have to use an interactive terminal. This might be a bit more tricky to set up but can still function as a one-click build from a commandbar (see [README: building your project](https://github.com/Eccenux/Wikiploy/blob/main/README.building%20your%20project.md)).

## Wikiploy types

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
* Example config file in: `assets\public--bot.config.mjs`.

**Warning!** Never, ever publish your bot password. If you do spill your password, reset/remove the password ASAP (on Special:BotPasswords).


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
