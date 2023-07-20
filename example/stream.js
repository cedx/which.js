import console from "node:console";
import which from "@cedx/which";

try {
	console.log('The "foobar" command is available at these locations:');
	for await (const path of which("foobar").stream()) console.log(`- ${path}`);
}
catch {
	console.error("The 'foobar' command has not been found.");
}
