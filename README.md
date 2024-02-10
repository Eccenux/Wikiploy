Wikiploy
==========================

Wikiploy is a one-click solution to deploy JS and CSS to Wikipedia.

After the initial setup, you can quickly build and deploy your user scripts and gadgets. Though this was designed to work with Wikipedia, you should be able to deploy to any [MediaWiki](https://www.mediawiki.org/)-based wiki. You can even deploy to multiple websites with just one click on your commandbar. Your only limitation is your access level to the wikis.

See also:

- [README: building your project](https://github.com/Eccenux/Wikiploy/blob/main/README.building%20your%20project.md) recommendation on how to build JS and CSS for your gadgets (includes unit testing setup).
- [Wikipedia:Wikiploy on pl.wiki](https://pl.wikipedia.org/wiki/Wikipedia:Wikiploy) for Polish description.
- (more links on the bottom)

## New capabilities

### Lightweight Dependencies (v2.0)

We had a good run, but it's time to bid farewell to the [Puppeteer](https://pptr.dev/) and free the puppets ;). Obviously, this might be a breaking change if you really need to use it. However, the Wikiploy API doesn't really change...

The only change is that you need to provide bot configuration to Wikiploy (as already described for WikiployLite). It's not nothing, but you only need to follow few steps from the [Botpass configuration section](#botpass-configuration). You only need to do it once and then use in all your user scripts.

`WikiployLite` is now a synonym to `Wikiploy`.

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

## Using Wikiploy

The `Wikiploy` class can be used to help deploy scripts. It is using a bot API to do that, but don't worry, you don't need to be a bot ;).

You do need to setup a bot password though (on [[Special:BotPasswords]]). It's not as hard as it might seem as you can do this on any Wikimedia wiki and it will work for all WMF wikis. You don't need a bot account for this to work. You will just create an alias for your stadnard account and special password just for your scripts.

## Botpass configuration
A bot password is just a sub-account. It helps to keep things separated and safe.

1. Setup your sub-account on e.g.: https://test.wikipedia.org/wiki/Special:BotPasswords
2. Choose a name and rights for your sub-account. Example rights you should setup to deploy gadgets (if you can): [assets\Bot passwords - Test Wikipedia.png](https://github.com/Eccenux/Wikiploy/blob/main/assets/Bot%20passwords%20-%20Test%20Wikipedia.png).
3. Create your `bot.config.mjs` file. You can find an example config file in: `assets\public--bot.config.mjs`.

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
