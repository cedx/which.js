import console from "node:console";
import which from "@cedx/which";

/**
 * Finds all instances of an executable and returns them one at a time.
 */
try {
	console.log('The "foobar" command is available at these locations:');
	for await (const path of which("foobar").stream()) console.log(`- ${path}`);
}
catch {
	console.error("The 'foobar' command has not been found.");
}
