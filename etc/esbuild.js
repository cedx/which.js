import {env} from "node:process";

/**
 * Returns the build options of the client application.
 * @returns {import("esbuild").BuildOptions} Thebuild options of the client application.
 */
export default function buildOptions() {
	const production = env.NODE_ENV == "production";
	return {
		banner: {js: "#!/usr/bin/env node"},
		bundle: true,
		conditions: production ? [] : ["development"],
		drop: production ? ["debugger"] : [],
		entryPoints: ["src/cli.ts"],
		format: "esm",
		legalComments: "none",
		minify: production,
		outfile: "bin/which.js",
		platform: "node",
		sourceRoot: new URL("../bin/", import.meta.url).href,
		sourcemap: !production,
		treeShaking: production
	};
}
