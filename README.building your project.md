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
	"name": "wiki-gadget-yourgadgetname",
	"type": "commonjs",
	"scripts": {
		"test": "mocha",
		"build": "browserify src/main.js -o dist/yourGadgetName.js",
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

Your **common deployment script** `wikiploy-common.mjs`:
```js
import { DeployConfig, userPrompt } from 'wikiploy';

/**
 * Add config.
 * @param {Array} configs DeployConfig array.
 * @param {String} site Domian of a MW site.
 */
export function addConfig(configs, site) {
	configs.push(new DeployConfig({
		src: 'dist/yourGadgetName.js',
		dst: '~/yourGadgetName.js',
		site,
		nowiki: true,
	}));
	configs.push(new DeployConfig({
		src: 'dist/yourGadgetName.css',
		dst: '~/yourGadgetName.css',
		site,
	}));
}

/**
 * Read and setup summary.
 * @param {WikiployLite} ployBot 
 */
export async function setupSummary(ployBot) {
	const summary = await userPrompt('Summary of changes (empty for default summary):');
	if (typeof summary === 'string' && summary.length) {
		ployBot.summary = () => {
			return summary;
		};
	}
}
```
We use a separate file to define common functions, making changes to both release and dev Wikiploy scripts simpler.

Note that `~` in `dst` properties will be replaced with `User:SomeName`, representing the user space of the currently logged-in user (your user space). For more details about this basic code and `DeployConfig` properties, refer to the [Wikiploy rollout example](https://github.com/Eccenux/wikiploy-rollout-example/).

Your minimal **developer deployment script** `wikiploy-dev.mjs`:
```js
import { WikiployLite } from 'wikiploy';

import * as botpass from './bot.config.js';
const ployBot = new WikiployLite(botpass);

// common deploy function(s)
import { addConfig, setupSummary } from './wikiploy-common.mjs';

// run asynchronously to be able to wait for results
(async () => {
	// custom summary from a prompt
	await setupSummary();

	// push out file(s) to wiki
	const configs = [];
	addConfig(configs, 'en.wikipedia.org');

	await ployBot.deploy(configs);

})().catch(err => {
	console.error(err);
	process.exit(1);
});
```

Your **main deployment script** `wikiploy.mjs`:
```js
import { WikiployLite } from 'wikiploy';

import * as botpass from './bot.config.js';
const ployBot = new WikiployLite(botpass);

// common deploy function(s)
import { addConfig, setupSummary } from './wikiploy-common.mjs';

// run asynchronously to be able to wait for results
(async () => {
	// custom summary from a prompt
	await setupSummary();

	// push out file(s) to wiki
	const configs = [];
	addConfig(configs, 'pl.wikipedia.org');
	addConfig(configs, 'en.wikipedia.org');
	addConfig(configs, 'pl.wikisource.org');

	await ployBot.deploy(configs);

})().catch(err => {
	console.error(err);
	process.exit(1);
});
```

## Release vs dev release

### Deploying as a gadget

There are various ways you could develop gadgets. The most standard way would be to deploy to the `MediaWiki:Gadget-` namespace.

In `wikiploy-common.mjs` add:
```js
export function addConfigRelease(configs, site) {
	configs.push(new DeployConfig({
		src: 'dist/yourGadgetName.js',
		dst: 'MediaWiki:Gadget-yourGadgetName.js',
		site,
		nowiki: true,
	}));
	configs.push(new DeployConfig({
		src: 'dist/yourGadgetName.css',
		dst: 'MediaWiki:Gadget-yourGadgetName.css',
		site,
	}));
}
```

In your main deployment script you could have something like (`wikiploy.mjs`):
```js
	// dev version
	addConfig(configs, 'en.wikipedia.org');
	// release versions
	addConfigRelease(configs, 'pl.wikipedia.org');
	addConfigRelease(configs, 'pl.wikisource.org');
	addConfigRelease(configs, 'en.wikipedia.org');
```
The script doesn't have any limits. However, you do need interface-admin rights to deploy to the `MediaWiki:Gadget-` namespace. So, you might need to use `~/` to deploy to your user-space.

### Release version in your user space

**If you do *not* have interface-admin rights**, the functions could look like this:

```js
export function addConfig(configs, site, isRelease) {
	let deploymentName = isRelease ? '~/yourGadgetName' : '~/yourGadgetName-dev';
	configs.push(new DeployConfig({
		src: 'dist/yourGadgetName.js',
		dst: `${deploymentName}.js`,
		site,
		nowiki: true,
	}));
	configs.push(new DeployConfig({
		src: 'dist/yourGadgetName.css',
		dst: `${deploymentName}.css`,
		site,
	}));
}
export function addConfigRelease(configs, site) {
	addConfig(configs, site, true);
}
```

In this case, you have both dev and release versions in your user space. Frankly, this might be the best choice, even if you have admin rights, especially if you use the *loader pattern*.

### Loader pattern for gadgets

Even if you have all administrative rights on a wiki, you might still want to load the main script from a small loader. The **loader pattern** allows you to provide conditions for loading the main script from the gadget file.

The loader pattern is most useful when you want to test specific capabilities of a device and only then load the script. This is how you could load popups (which don't work well on touch devices, i.e., devices that cannot hover).

Example of what `MediaWiki:Gadget-Popups.js` could look like:
```js
// only on devices that can hover (not on touch-only, so not on smartphones)
if (window.matchMedia && !window.matchMedia("(hover: none)").matches) {
	importScript('User:Nux/Popups.js');
}
```

You could also have a gadget that is default, but only works on specific pages:
```js
// load config
var config = mw.config.get( [
	'wgNamespaceNumber',
	'wgTitle',
] );
// only on AfD subpages
if ( config.wgNamespaceNumber == 4 && config.wgTitle.startsWith('Articles for deletion/') ) {
	importScript('User:Nux/AfD-helper.js');
}
```
The loader pattern is beneficial because it improves website performance. In this pattern, the main gadget code is only loaded when it can be useful.

Loading from the `User` namespace might also help make it clear who is responsible for the gadget. However, it might not work when there is no single user responsible, such as when the main author becomes inactive. The community can always decide to fork the script, so that should not be a problem in practice.

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
window.yourGadgetName = gadget;

// hook when object is ready
mw.hook('userjs.yourGadgetName.loaded').fire(gadget);

$(function(){
	// load Mediwiki core dependency
	// (in this case util is for `mw.util.addPortletLink`)
	mw.loader.using(["mediawiki.util"]).then( function() {
		gadget.init();

		// hook when initial elements are ready 
		mw.hook('userjs.yourGadgetName.ready').fire(gadget);
	});
});
```

As you can see, hooks are better because you can keep the name of the variable short. It's also much easier to make sure each dependency is loaded so other devs can use your hooks in other gadgets, and your users can customize the script.

User options:
```js
mw.hook('userjs.yourGadgetName.loaded').add(function (gadget) {
	gadget.options.createTool = false;
});
importScript('User:Nux/yourGadgetName.js');
```
A more advanced customization:
```js
mw.hook('userjs.yourGadgetName.ready').add(function (gadget) {
	var $tool = $('#some-unique-gadget-tool a');
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
yourClassyGadgetName [ResourceLoader | requiresES6 | dependencies = mediawiki.util] | yourGadgetName.js | yourGadgetName.css
```


Example `MyGadget.js` with a link in the toolbar:
```js
/**
 * Wikiploy gadget example.
 * 
 * History and docs:
 * https://github.com/Eccenux/wikiploy-rollout-example
 * 
 * Deployed using: [[Wikipedia:Wikiploy]]
 */
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
			$(item).on('click', (evt) => {
				evt.preventDefault();
				this.openDialog();
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
