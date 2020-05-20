#!/usr/bin/env node
import {FinderError} from "../lib/index.js";
import {main} from "../lib/cli/main.js";

// Start the application.
main().catch(err => {
	if (err instanceof FinderError) process.exitCode = 1;
	else {
		console.error(err.message);
		process.exitCode = 2;
	}
});
