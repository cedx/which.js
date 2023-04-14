#!/usr/bin/env node
import console from "node:console";
import {readFileSync} from "node:fs";
import {EOL} from "node:os";
import process from "node:process";
import {parseArgs} from "node:util";
import which from "../src/index.js";

// The usage information.
const usage = `
Find the instances of an executable in the system path.

Usage:
  which [options] <command>

Arguments:
  command        The name of the executable to find.

Options:
  -a, --all      List all executable instances found (instead of just the first one).
  -s, --silent   Silence the output, just return the exit code (0 if any executable is found, otherwise 1).
  -h, --help     Display this help.
  -v, --version  Output the version number.
`;

// Start the application.
let silent = false;

try {
	// Parse the command line arguments.
	const {positionals, values} = parseArgs({allowPositionals: true, options: {
		all: {short: "a", type: "boolean", default: false},
		help: {short: "h", type: "boolean", default: false},
		silent: {short: "s", type: "boolean", default: false},
		version: {short: "v", type: "boolean", default: false}
	}});

	silent = values.silent ?? false;

	// Print the usage.
	if (values.help || values.version) {
		const {version} = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
		console.log(values.version ? version : usage.trim());
		process.exit(0);
	}

	// Check the requirements.
	if (!positionals.length) {
		console.error("Required argument 'command' is missing.");
		process.exit(1);
	}

	// Find the executable.
	const finder = which(/** @type {string} */ (positionals.shift()));
	let paths = await (values.all ? finder.all() : finder.first());
	if (!silent) {
		if (!Array.isArray(paths)) paths = [paths];
		console.log(paths.join(EOL));
	}
}
catch (error) {
	if (!silent) console.error(error instanceof Error ? error.message : error);
	process.exit(1);
}
