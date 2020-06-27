import program from "commander";
import { which } from "../which.js";
import { packageVersion } from "./version.g.js";
/**
 * Application entry point.
 * @return Completes when the program is terminated.
 */
export async function main() {
    // Initialize the application.
    process.title = "Which.js";
    // Parse the command line arguments.
    program.name("which")
        .description("Find the instances of an executable in the system path.")
        .version(packageVersion, "-v, --version")
        .option("-a, --all", "list all instances of executables found (instead of just the first one)")
        .option("-s, --silent", "silence the output, just return the exit code (0 if any executable is found, otherwise 1)")
        .arguments("<command>").action(command => program.executable = command)
        .parse(process.argv);
    if (!program.executable) {
        program.outputHelp();
        process.exitCode = 64;
        return;
    }
    // Run the program.
    let executables = await which(program.executable, { all: program.all });
    if (!program.silent) {
        if (!Array.isArray(executables))
            executables = [executables];
        for (const path of executables)
            console.log(path); // eslint-disable-line no-console
    }
}
