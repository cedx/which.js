import {which} from "@cedx/which";
import console from "node:console";

// Finds the first instance of an executable.
try {
	const path = await which("foobar").first();
	console.log(`The "foobar" command is located at: ${path}`);
}
catch (error) {
	console.error(error instanceof Error ? error.message : error);
}
