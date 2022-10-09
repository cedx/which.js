#!/usr/bin/env node
import console from "node:console";
import {EOL} from "node:os";
import process from "node:process";
import {parseArgs} from "node:util";
import pkg from "../package.json" assert {type: "json"};
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

// Parse the command line arguments.
const {positionals, values} = parseArgs({allowPositionals: true, options: {
	all: {short: "a", type: "boolean"},
	help: {short: "h", type: "boolean"},
	silent: {short: "s", type: "boolean"},
	version: {short: "v", type: "boolean"}
}});

// Print the usage.
if (values.help || values.version) {
	console.log(values.version ? pkg.version : usage.trim());
	process.exit();
}

// Check the requirements.
if (!positionals.length) {
	console.error("Required argument 'command' is missing.");
	process.exit(1);
}

// Start the application.
try {
	const finder = which(positionals[0]);
	let paths = await (values.all ? finder.all() : finder.first());
	if (!values.silent) {
		if (!Array.isArray(paths)) paths = [paths];
		console.log(paths.join(EOL));
	}
}
catch (error) {
	if (!values.silent) console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
}
