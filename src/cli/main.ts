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
 */
async function main(): Promise<void> {
	// Parse the command line arguments.
	const {positionals, values} = parseArgs({allowPositionals: true, options: {
		all: {short: "a", type: "boolean", default: false},
		help: {short: "h", type: "boolean", default: false},
		silent: {short: "s", type: "boolean", default: false},
		version: {short: "v", type: "boolean", default: false}
	}});

	// Print the usage.
	if (values.help || values.version) // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
		return console.log(values.version ? pkg.version : usage.trim());

	// Check the requirements.
	if (!positionals.length) throw Error("You must provide the name of a command to find.");

	// Find the instances of the provided executable.
	silent = values.silent ?? false;
	const finder = which(positionals[0]);
	const paths = await (values.all ? finder.all() : finder.first());
	if (!silent) console.log(Array.isArray(paths) ? paths.join(EOL) : paths);
}

// Start the application.
main().catch(error => {
	if (!silent) console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
});
