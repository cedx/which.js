import {which} from "@cedx/which";
import console from "node:console";

// Finds all instances of an executable.
try {
	const paths = await which("foobar").all();
	console.log('The "foobar" command is available at these locations:');
	for (const path of paths) console.log(`- ${path}`);
}
catch (error) {
	console.error(error instanceof Error ? error.message : error);
}
