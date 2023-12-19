import readline from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';

const userPrompt = (prompt) => {
	const rl = readline.createInterface({ input, output });

	return new Promise((resolve) => {
		rl.question(prompt, (summary) => {
			rl.close();

			resolve(summary);
		});
	});
};

export { userPrompt };
