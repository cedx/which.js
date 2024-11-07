import console from "node:console"
import {EOL} from "node:os"
import process from "node:process"
import {parseArgs} from "node:util"
import {which} from "./index.js"

# The usage information.
usage = """
Find the instances of an executable in the system path.

Usage:
	which [options] <command>

Arguments:
	command        The name of the executable to find.

Options:
	-a, --all      List all executable instances found (instead of just the first one).
	-s, --silent   Silence the output, just return the exit code (0 if any executable is found, otherwise 1).
	-h, --help     Display this help.
	-v, --version  Output the version number.
"""

# Value indicating whether to silence the output.
silent = no

try
	# Parse the command line arguments.
	{positionals, values} = parseArgs allowPositionals: yes, options:
		all: {short: "a", type: "boolean", default: off}
		help: {short: "h", type: "boolean", default: off}
		silent: {short: "s", type: "boolean", default: off}
		version: {short: "v", type: "boolean", default: off}

	# Print the usage.
	if values.help
		console.log usage.replaceAll "\t", "  "
		process.exit()

	if values.version
		pkg = await import("../package.json", with: {type: "json"})
		console.log pkg.default.version
		process.exit()

	# Check the requirements.
	unless positionals.length
		console.log "You must provide the name of a command to find."
		process.exit 400

	# Find the instances of the provided executable.
	{silent} = values
	finder = which positionals[0]
	paths = await (if values.all then finder.all() else finder.first())
	console.log(if Array.isArray paths then paths.join EOL else paths) unless silent

catch error
	console.error(if error instanceof Error then error.message else error) unless silent
	process.exit 404
