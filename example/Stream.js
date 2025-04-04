import {which} from "@cedx/which";
import console from "node:console";

// Finds all instances of an executable and returns them one at a time.
try {
	const {stream} = which("foobar");
	console.log('The "foobar" command is available at these locations:');
	for await (const path of stream) console.log(`- ${path}`);
}
catch (error) {
	console.error(error instanceof Error ? error.message : error);
}
