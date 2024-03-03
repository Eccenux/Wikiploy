import DeployConfig from './DeployConfig.js';
import WikiployLite from './WikiployLite.js';
import * as verlib from './version.js';
import { userPrompt, setupSummary } from './userPrompt.js';

const Wikiploy = WikiployLite;

export {
	DeployConfig,
	verlib,
	userPrompt,
	setupSummary,
	WikiployLite,
	Wikiploy
};