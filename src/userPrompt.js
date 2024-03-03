import readline from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';

/**
 * Prompt for summary.
 * @param {String} prompt Prompt information to display.
 * @returns 
 */
const userPrompt = (prompt) => {
	const rl = readline.createInterface({ input, output });

	return new Promise((resolve) => {
		rl.question(prompt, (summary) => {
			rl.close();

			resolve(summary);
		});
	});
};

/**
 * Read (prompt) and setup summary.
 * @param {WikiployLite} ployBot Bot object (required to setup `summary()`).
 * @param {Number} version Gadget version.
 * @param {String} standardSummary Standard summary (aside from version).
 */
async function setupSummary(ployBot, version = '', standardSummary = 'changes from Github') {
	let info = version.length ? `(empty for a standard summary prefixed with v${version})` : `(empty for a standard summary)`;
	let summary = await userPrompt(`Summary of changes ${info}:`);
	if (typeof summary !== 'string' || !summary.length) {
		summary = standardSummary;
	}
	ployBot.summary = () => {
		return version.length ? `v${version}: ${summary}` : summary;
	};
	console.log(`[INFO] summary: »${ployBot.summary()}«\n`);
}

export { userPrompt, setupSummary };
