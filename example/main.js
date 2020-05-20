import {which} from "@cedx/which";

/**
 * Finds the instances of an executable.
 * @return {Promise<void>} Completes when the program is terminated.
 */
async function main() {
	try {
		// `path` is the absolute path to the executable.
		const path = await which("foobar");
		console.log(`The command 'foobar' is located at: ${path}`);
	}

	catch (err) {
		// `err` is an instance of `FinderError`.
		console.log(`The command '${err.command}' was not found`);
	}
}
