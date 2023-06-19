import {
	scrollIntoViewIfNeeded,
	waitForSelector,
	waitForSelectors,
} from './chromeBase.js'

import PageCache from './PageCache.js';

/**
 * Helper class for edits and navigation.
 * 
 * Note! Due to Chrome's large memory consupmtion on new tabs it is best to re-use tabs.
 * So it is best to open tab before loop:
		// open new tab
		const page = await wikiBot.openTab(browser);
		// some loop
		for () {
			await page.goto(url);
			...do stuff...
		}
		page.close();
 */
export default class WikiOps {
	/**
	 * Init.
	 * @param {PageCache} globalCache Cache for page resources.
	 */
	constructor(globalCache) {
		this.cache = globalCache ? globalCache : new PageCache();
	}

	/**
	 * Open new tab.
	 * @returns {Browser} browser.
	 */
	async openTab(browser) {
		const page = await browser.newPage();
		await this.initViewport(page);
		await this.cache.enable(page);
		await this.disarmUnloadWarning(page);
		const timeout = 5000;
		page.setDefaultTimeout(timeout);
		return page;
	}

	/**
	 * Avoid leave-page warning.
	 * @param {Page} page
	 * @private
	 */
	async disarmUnloadWarning(page) {
		// force to accept the warning
		page.on("dialog", (dialog) => {
			if (dialog.type() === "beforeunload") {
				dialog.accept();
			}
		});
		await page.evaluate(() => {
			window.onbeforeunload = null;
			window.addEventListener("load", () => {
				$(window).off('beforeunload');
			});
		});
	}

	/**
	 * Init view.
	 * @param {Page} targetPage 
	 * @private
	 */
	async initViewport(targetPage) {
		await targetPage.setViewport({
			width: 1200,
			height: 900
		})
	}

	/** Save. */
	async saveEdit(targetPage) {
		const timeout = 200;

		await scrollIntoViewIfNeeded([
			'#wpSave'
		], targetPage, timeout);
		const element = await waitForSelectors([
			'#wpSave'
		], targetPage, {
			timeout,
			visible: true
		});
		let nav = targetPage.waitForNavigation(); // init wait
		await element.click({
			offset: {
				x: 10,
				y: 4,
			},
		});
		await nav; // wait for form submit
	}

	/** Go to url (and wait for it). */
	async goto(page, url) {
		let nav = page.waitForNavigation(); // init wait
		await page.goto(url);
		await nav; // wait for url
		await this.disarmUnloadWarning(page);
	}

	/** Change intput's value. */
	async fillEdit(page, value) {
		const timeout = 5000;
		await waitForSelector('#editform', page, {
			timeout,
		});
		// await changeElementValue(element, value);
		await page.evaluate((value) => {
			// remove editors (plain, WYSIWYG)
			document.querySelectorAll('#editform textarea, .ace_editor').forEach(el=>el.remove());
			// add plain textarea
			document.querySelector('#editform').insertAdjacentHTML('afterbegin', `
				<textarea id="wpTextbox1" name="wpTextbox1"
				></textarea>
			`);
			// insert value
			let input = document.querySelector('#wpTextbox1');
			input.value = value;
		}, value);
	}

	/** Insert summary. */
	async fillSummary(page, summary) {
		await page.evaluate((summary) => {
			let wpSummary = document.querySelector('#wpSummary');
			wpSummary.value = summary;
		}, summary);
	}

	
}