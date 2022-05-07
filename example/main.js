import {which} from "@cedx/which";

/**
 * Finds the instances of an executable.
 * @returns {Promise<void>} Completes when the program is terminated.
 */
async function main() {
	try {
		// `path` is the absolute path to the executable.
		const path = await which("foobar");
		console.log(`The command 'foobar' is located at: ${path}`);
	}

	catch (error) {
		// `error` is an instance of `FinderError`.
		console.log(`The command '${error.command}' was not found`);
	}
}
