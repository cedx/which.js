import console from "node:console";
import {EOL} from "node:os";
import process from "node:process";
import {parseArgs} from "node:util";
import pkg from "../../package.json" with {type: "json"};
import usage from "./usage.js";
import which from "../index.js";

/**
 * Value indicating whether to silence the output.
 */
let silent = false;

/**
 * Application entry point.
 * @returns The application exit code.
 */
async function main(): Promise<number> {
	// Parse the command line arguments.
	const {positionals, values} = parseArgs({allowPositionals: true, options: {
		all: {short: "a", type: "boolean"},
		help: {short: "h", type: "boolean"},
		silent: {short: "s", type: "boolean"},
		version: {short: "v", type: "boolean"}
	}});

	// Print the usage.
	if (values.help || values.version) { // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
		console.log(values.version ? pkg.version : usage.trim());
		return 0;
	}

	// Check the requirements.
	if (!positionals.length) {
		console.error("You must provide the name of a command to find.");
		return 1;
	}

	// Find the instances of the provided executable.
	silent = values.silent ?? false;
	const finder = which(positionals[0]);
	const paths = await (values.all ? finder.all() : finder.first());
	if (!silent) console.log(Array.isArray(paths) ? paths.join(EOL) : paths);
	return 0;
}

// Start the application.
main().then(exitCode => process.exitCode = exitCode, error => {
	if (!silent) console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
});
