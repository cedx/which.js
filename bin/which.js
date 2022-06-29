#!/usr/bin/env node
import console from "node:console";
import process from "node:process";
import {program} from "commander";
import pkg from "../package.json" assert {type: "json"};
import which from "../lib/index.js";

// Parse the command line arguments.
program.name("which")
	.description("Find the instances of an executable in the system path.")
	.version(pkg.version, "-v, --version")
	.option("-a, --all", "list all executable instances found (instead of just the first one)")
	.option("-s, --silent", "silence the output, just return the exit code (0 if any executable is found, otherwise 1)")
	.argument("<command>", "the name of the executable to find")
	.parse();

// Start the application.
const [command] = program.args;
const {all, silent} = program.opts();

try {
	const finder = which(command);
	let paths = await (all ? finder.all() : finder.first());
	if (!silent) {
		if (!Array.isArray(paths)) paths = [paths];
		paths.forEach(path => console.log(path));
	}
}
catch (error) {
	if (!silent) console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
}
