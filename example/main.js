import console from "node:console";
import which from "@cedx/which";

try {
	const path = await which("foobar").first();
	console.log(`The command 'foobar' is located at: ${path}`);
}
catch (error) {
	console.error("The command 'foobar' has not been found.");
}
