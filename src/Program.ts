import console from "node:console";
import {EOL} from "node:os";
import {exit} from "node:process";
import {parseArgs} from "node:util";
import pkg from "../package.json" with {type: "json"};
import {which} from "./Main.js";

// The usage information.
const usage = `
Find the instances of an executable in the system path.

Usage:
	npx @cedx/which [options] <command>

Arguments:
	command        The name of the executable to find.

Options:
	-a, --all      List all executable instances found (instead of just the first one).
	-q, --quiet   Silence the output, just return the exit code (0 if any executable is found, otherwise 404).
	-h, --help     Display this help.
	-v, --version  Output the version number.
`;

// Value indicating whether to silence the output.
let quiet = false;

try {
	// Parse the command line arguments.
	const {positionals, values} = parseArgs({allowPositionals: true, options: {
		all: {short: "a", type: "boolean", default: false},
		help: {short: "h", type: "boolean", default: false},
		quiet: {short: "q", type: "boolean", default: false},
		version: {short: "v", type: "boolean", default: false}
	}});

	// Print the usage.
	if (values.help || values.version) {
		console.log(values.version ? pkg.version : usage.trim().replaceAll("\t", "  "));
		exit(0);
	}

	// Check the requirements.
	if (!positionals.length) {
		console.log("You must provide the name of a command to find.");
		exit(400);
	}

	// Find the instances of the provided executable.
	({quiet} = values);
	const resultSet = which(positionals[0]);
	const paths = values.all ? await resultSet.all : [await resultSet.first];
	if (!quiet) console.log(paths.join(EOL));
}
catch (error) {
	if (!quiet) console.error(error instanceof Error ? error.message : error);
	exit(404);
}
