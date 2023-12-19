# Building your project

There are various ways to build scripts. You can use [browserify](https://browserify.org/), webpack, TypeScript compiler, etc., or even choose not to build at all. Wikiploy doesn't force the use of any specific tool (you are free to choose whatever you are comfortable with). However, not all solutions are equally well-suited for the wiki world, and choosing the right solution takes time.

Let me save you some time. Below is a recommended project setup based on some of my real scripts and years of experience building gadgets. If you're interested, you can take a look at a real-world script: [wikibot-jsbot-core](https://github.com/Eccenux/wikibot-jsbot-core) (it's a bit experimental, but you might find some interesting constructs there). For a more stable example, you might want to explore the template repository for Wikiploy: [wikiploy-rollout-example](https://github.com/Eccenux/wikiploy-rollout-example).

## Recommended setup for building scripts

Example `.gitignore` for your project:
```
/node_modules
*.lnk
*.priv.*
bot.config.*
```

Your `package.json` (crucial part being `scripts`):
```js
{
	"name": "wiki-gadget-yourgadetname",
	"type": "commonjs",
	"scripts": {
		"test": "mocha",
		"build": "browserify src/main.js -o dist/yourGadetName.js",
		"deploy-dev": "node wikiploy-dev.mjs",
		"deploy": "node wikiploy.mjs",
		"rollout-dev": "npm run build && npm run deploy-dev",
		"rollout": "npm run build && npm run deploy"
	},
	"devDependencies": {
		"browserify": "17.x",
		"chai": "4.x",
		"eslint": "8.x",
		"mocha": "10.x"
	},
	"dependencies": {
		"wikiploy": "1.x"
	}
}
```

Your `src/main.js` could look something like this:
```js
var { MyGadget } = require("./MyGadget");

// instance
var gadget = new MyGadget();

// init elements
$(function(){
	gadget.init();
})
```

Your `src/MyGadget.js` could look something like this:
```js
function MyGadget() {
	/** Initialize things when DOM is ready. */
	this.init = function() {
		console.log("init done");
	}
}

module.exports = { MyGadget };
```

Remember to install tools after changing `package.json`:
```bash
npm i
```

And now you should already be able to build the script:
```bash
npm run build
```

Now we just need to setup things so that we don't have to build and deploy things manually.

## Visual Studio Code setup

[VSC](https://code.visualstudio.com/) is a free editor that has evolved over the years to become almost like an IDE. It is great for developing JS scripts.

Add `.vscode/extensions.json` to help install a set of **extensions**:
```js
{
	"recommendations": [
		"gsppvo.vscode-commandbar",
		"hbenl.vscode-test-explorer",
		"hbenl.vscode-mocha-test-adapter"
	]
}
```

VSC **settings** `.vscode/settings.json`:
```js
{
    "editor.detectIndentation": false,
    "editor.useTabStops": true,
    "editor.insertSpaces": false,
	"search.exclude": {
		"package-lock.json": true,
		"**/dist/": true,
	},
}
```

Using tabs vs spaces is obviously your preference. People tend to have conflicting opinions on that. The simple truth is that a tab is one byte, and 4 spaces are 4 bytes, but use whatever works for your project. Just remember to enforce it at the project level so that the style is consistent.

VSC **tasks** `.vscode/tasks.json`:
```js
{
	"version": "2.0.0",
	"tasks": [
		{
			"type": "npm",
			"script": "test",
			"group": "test",
			"problemMatcher": [],
			"label": "Run tests",
			"detail": "mocha"
		},
		{
			"type": "npm",
			"script": "deploy-dev",
			"group": "none",
			"problemMatcher": [],
			"label": "Run dev deploy",
			"detail": "Run deploy script (wikiploy)"
		},
		{
			"type": "npm",
			"script": "deploy",
			"group": "none",
			"problemMatcher": [],
			"label": "Run deploy",
			"detail": "Run deploy script (wikiploy)"
		},
		{
			"type": "npm",
			"script": "rollout-dev",
			"group": "none",
			"problemMatcher": [],
			"label": "Run dev rollout",
			"detail": "Run rollout script (browserify & wikiploy)"
		},
		{
			"type": "npm",
			"script": "rollout",
			"group": "none",
			"problemMatcher": [],
			"label": "Run rollout",
			"detail": "Run rollout script (browserify & wikiploy)"
		},
		{
			"type": "npm",
			"script": "install",
			"group": "none",
			"problemMatcher": [],
			"label": "npm install",
			"detail": "install dependencies from package"
		}
	]
}
```

When you use tasks, VSC runs an interactive terminal. This makes some scripts work better:
- Any scripts that use colors in the terminal will work with tasks.
- An interactive shell is required for the `userPrompt` helper (see *Deploy script*).
- Text progress (like in npm install) looks much better with tasks.

VCS **commandbar** `.vscode/commandbar.json`:
```js
// Remember to change VSC settings (UI): in `files.associations` add `commandbar.json: jsonc`
{
	"skipTerminateQuickPick": true,
	"skipSwitchToOutput": false,
	"skipErrorMessage": true,
	"commands": [
		// "commandType": "script" runs npm script directly
		{
			"text": "test",
			"tooltip": "Run mocha tests.",
			"color": "lightgreen",
			"commandType": "script",
			"command": "test",
			"priority": 0
		},
		
		{
			"text": "build",
			"tooltip": "Run the browserify build.",
			"color": "lightgreen",
			"commandType": "script",
			"command": "build",
			"priority": 0
		},
		
		// running deployment as a task (so that prompts work)
		// note that "Run dev deploy" is a label from tasks.json 
		{
			"text": "wikiploy-dev",
			"tooltip": "Deploy pre-built script.",
			"color": "lightgreen",
			"commandType": "palette",
			"command": "workbench.action.tasks.runTask|Run dev deploy",
			"priority": 0
		},

		// this our one-click rollout
		{
			"text": "build & deploy-dev",
			"tooltip": "Build (browserify) and deploy (wikiploy).",
			"color": "lightgreen",
			"commandType": "palette",
			"command": "workbench.action.tasks.runTask|Run dev rollout",
			"priority": 0
		}
	]
}
```

Note: You should also change VSC settings (UI) under `files.associations` to add `commandbar.json: jsonc` (JSON with comments). This allows comments in JSON, making it more understandable. Otherwise, VSC will complain about inline comments.

Also, note: Above, we only added dev tasks to the command bar. This is just for brevity. The same commands can be added for other tasks.

## Deploy script

Your **bot password** configuration `bot.config.mjs`:
```js
/**
	Bot with edit&create rights.
	
	https://test.wikipedia.org/wiki/Special:BotPasswords/Wikiploy

	The new password to log in with Nux@Wikiploy.
	Where "Nux" is a Wikipedia username and "Wikiploy" is a bot name choosen in [[Special:BotPasswords]].
 */
export const username = 'Nux@Wikiploy';
export const password = '0abc...fckgw';
```

Your minimal **developer deployment script** `wikiploy-dev.mjs`:
```js
import {DeployConfig, WikiployLite, userPrompt} from 'wikiploy';

import * as botpass from './bot.config.js';
const ployBot = new WikiployLite(botpass);

// default site for DeployConfig
ployBot.site = "en.wikipedia.org";

// run asynchronously to be able to wait for results
(async () => {
	// custom summary from a prompt
	const summary = await userPrompt('Summary of changes (empty for default summary):');
	if (typeof summary === 'string' && summary.length) {
		ployBot.summary = () => {
			return summary;
		}
	}

	// push out file(s) to wiki
	const configs = [];
	configs.push(new DeployConfig({
		src: 'dist/yourGadetName.js',
		dst: '~/yourGadetName.js',
		nowiki: true,
	}));
	configs.push(new DeployConfig({
		src: 'dist/yourGadetName.css',
		dst: '~/yourGadetName.css',
	}));

	await ployBot.deploy(configs);

})().catch(err => {
	console.error(err);
	process.exit(1);
});
```

Note that `~` will be `User:SomeName` so the user space of a currently logged in user (you user space).
You can omit `dst` and it will default to `dst: '~/${src}'`. More about this basic code and `dst` in the [Wikiploy rollout example](https://github.com/Eccenux/wikiploy-rollout-example/).

Config for your **main deployment script** `wikiploy.mjs`:
```js
// [...] (same sa -dev)

	// push out file(s) to wiki
	// dev version
	const configs = [];
	configs.push(new DeployConfig({
		src: 'dist/yourGadetName.js',
		dst: '~/yourGadetName.js',
		nowiki: true,
	}));
	configs.push(new DeployConfig({
		src: 'dist/yourGadetName.css',
		dst: '~/yourGadetName.css',
	}));
	// gadget
	configs.push(new DeployConfig({
		src: 'dist/yourGadetName.js',
		dst: 'MediaWiki:Gadget-yourGadetName.js',
		nowiki: true,
	}));
	configs.push(new DeployConfig({
		src: 'dist/yourGadetName.css',
		dst: 'MediaWiki:Gadget-yourGadetName.css',
	}));

	await ployBot.deploy(configs);

})().catch(err => {
	console.error(err);
	process.exit(1);
});
```

Note: Above is only the config part of the script.

We update both dev and release version above. This will make an empty edit in a dev script if you already deployed it.

Though we only deploy to `site = "en.wikipedia.org"` you could use other configs to deploy to many wikis:
```js
function addConfig(configs, site) {
	configs.push(new DeployConfig({
		src: 'dist/yourGadetName.js',
		dst: 'MediaWiki:Gadget-yourGadetName.js',
		site,
		nowiki: true,
	}));
	configs.push(new DeployConfig({
		src: 'dist/yourGadetName.css',
		dst: 'MediaWiki:Gadget-yourGadetName.css',
		site,
	}));
}
addConfig(configs, 'pl.wikipedia.org');
addConfig(configs, 'pl.wikisource.org');
```
The script doesn't have any limits. You do need interface-admin rights to deploy to `MediaWiki:Gadget-` namespace. So you might need to use `~/` instead to deploy to your user-space.

## Exporting stuff 

Note that *browserify* will wrap your code with a function automatically, so you don't have to worry about leaking variables to the global scope (you should still remember to define variables with `var`, `let`, or `const`).

If you want to ***intentionally* expose** a variable, there are two ways to do that:

1. Use the `window` object (only if you have to).
2. Use *userjs* hooks (`mw.hook`).

Exposing things in `main.js` could look something like this:
```js
var { MyGadget } = require("./MyGadget");

// bot instance
var gadget = new MyGadget();

// expose for external usage (*not* recommended)
window.yourGadetName = gadget;

// hook when object is ready
mw.hook('userjs.yourGadetName.loaded').fire(gadget);

$(function(){
	// load Mediwiki core dependency
	// (in this case util is for `mw.util.addPortletLink`)
	mw.loader.using(["mediawiki.util"]).then( function() {
		gadget.init();

		// hook when initial elements are ready 
		mw.hook('userjs.yourGadetName.ready').fire(gadget);
	});
});
```

As you can see, hooks are better because you can keep the name of the variable short. It's also much easier to make sure each dependency is loaded so other devs can use your hooks in other gadgets, and your users can customize the script.

User options:
```js
mw.hook('userjs.yourGadetName.loaded').add(function (gadget) {
	gadget.options.createTool = false;
});
importScript('User:Nux/yourGadetName.js');
```
A more advanced customization:
```js
mw.hook('userjs.yourGadetName.ready').add(function (gadget) {
	var $tool = $('#some-unique-gadet-tool a');
	$tool.text($tool.text() + ' & plugin');
});
```

## Using classes

JS has classes for a long time. They don't work in IE and you cannot use them in default gadgets on Wikipedia. If you are building a default gadget you might want to add [babeljs](https://babeljs.io/) as a build step.
```bash
# install
npm install --save-dev babelify @babel/core
# build
browserify script.js -t babelify --outfile bundle.js
```

If the gadget is intended for advanced users it is safe to assume they won't use IE. So for most scripts you can probably skip babelify. But as of 2023 you will need `requiresES6` option in the gadget definition.

```
yourClassyGadetName [ResourceLoader | requiresES6 | dependencies = mediawiki.util] | yourGadetName.js | yourGadetName.css
```


Example `MyGadget.js` with a link in the toolbar:
```js
class MyGadget {
	constructor() {
		this.options = {
			createTool: true,
		};
	}

	/** Initialize things when DOM is ready. */
	init() {
		// Example link in the tools sidebar
		if (this.options.createTool) {
			var portletId = mw.config.get('skin') === 'timeless' ? 'p-pagemisc' : 'p-tb';
			var linkLabel = 'My gadget dialog';
			var itemId = 'some-unique-gadget-tool';
			var item = mw.util.addPortletLink(portletId, '#', linkLabel, itemId);
			$(item).on('click', function (evt) {
				evt.preventDefault();
				gadget.openDialog();
			});
		}
	}

	/** Open some dialog. */
	openDialog() {
		// Open a dialog window here
	}
}

module.exports = { MyGadget };
```

This MyGadget class will work with the `main.js` example from the section above.

## Appendix: Unit testing

Unit testing is important for the stability of tools. Not everything needs to be unit tested, but if you perform any kind of parsing or other complicated tasks, it is a good habit to add automatic tests.

There are many testing frameworks, but I mostly use Mocha/Chai. This is mainly because the [Chai assert API](https://www.chaijs.com/api/assert/) is very functional.

Below is an example test of `imdb.redir()` function. The test file `test/imdb.test.js`:
```js
/* global require, describe, it */
const { assert } = require('chai');
const imdb = require('../src/imdb');

describe('imdb', function () {
	describe('imdb redir', function () {
		// test function specific to *imdb redir*
		function test(text, expected) {
			// wrap
			let result = imdb.redir(text);
			if (result !== expected) {
				console.log({text, result, expected});
			}
			assert.equal(result, expected);
		}
		// actual test
		it('should resolve redirs', function () {
			test(`[[IMDb.com]]`, `[[IMDb]]`);
			test(`[[IMDb.com|abc]]`, `[[IMDb|abc]]`);
		});
	});
});
```
You don't have to define a `test` function, but having a function like that can help test many different cases quickly.

Visual Studio Code will let you run or even debug each `it` function separately, thanks to the *Vscode Test Explorer* extension.

## Appendix: Wiki2git

So now that we have everthing setup we need code right? If you already have a gadget you might to import it from Wikipedia.

```bash
# install
npm i -g wiki-to-git

# get metadata and insert commits to `src/NavFrame.js`
wiki2git-load --site pl.wikipedia.org -p "MediaWiki:Gadget-NavFrame.js"
wiki2git-commit --site pl.wikipedia.org --repo "gadget-NavFrame" -o "src/NavFrame.js"

# get metadata and insert commits to `src/NavFrame.css`
wiki2git-load --site pl.wikipedia.org -p "MediaWiki:Gadget-NavFrame.css"
wiki2git-commit --site pl.wikipedia.org --repo "gadget-NavFrame" -o "src/NavFrame.css"
```

Note that in the example above `gadget-NavFrame` is a repository folder.
This can be a repo that already exists or something that you've already setup.
