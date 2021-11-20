import {program} from "commander";
import {which} from "../which.js";
import {packageVersion} from "./version.g.js";

/**
 * Application entry point.
 * @return Completes when the program is terminated.
 */
export async function main(): Promise<void> {
	// Initialize the application.
	process.title = "Which.js";

	// Parse the command line arguments.
	let executable;
	program.name("which")
		.description("Find the instances of an executable in the system path.")
		.version(packageVersion, "-v, --version")
		.option("-a, --all", "list all instances of executables found (instead of just the first one)")
		.option("-s, --silent", "silence the output, just return the exit code (0 if any executable is found, otherwise 1)")
		.arguments("<command>").action(command => executable = command)
		.parse(process.argv);

	const options = program.opts();
	if (!executable) {
		program.outputHelp();
		process.exitCode = 64;
		return;
	}

	// Run the program.
	let paths = await which(executable, {all: options.all});
	if (!options.silent) {
		if (!Array.isArray(paths)) paths = [paths];
		for (const path of paths) console.log(path);
	}
}
