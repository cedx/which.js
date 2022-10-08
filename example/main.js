import console from "node:console";
import which from "@cedx/which";

try {
	const path = await which("foobar").first();
	console.log(`The 'foobar' command is located at: ${path}`);
}
catch {
	console.error("The 'foobar' command has not been found.");
}
