import fsa from 'fs/promises'

/** Read version from JSON file (like package.json). */
export async function readVersion (config) {
	const data = JSON.parse(await fsa.readFile(config, 'utf8'));
	return data.version;
}

/** Replace version placeholders. */
export function applyVersion (content, version) {
	return content.replace(/\{version\}/g, version);
}
