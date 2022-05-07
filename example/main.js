import which from "@cedx/which";

/**
 * Finds the instances of an executable.
 */
try {
	// `path` is the absolute path to the executable.
	const path = await which("foobar").first();
	console.log(`The command 'foobar' is located at: ${path}`);
}

catch (error) {
	// `error` is an instance of `FinderError`.
	console.log("The command 'foobar' has not been found.");
}
