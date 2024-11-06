import {which} from "@cedx/which"
import console from "node:console"

# Finds all instances of an executable.
try
	paths = await which("foobar").all()
	console.log 'The "foobar" command is available at these locations:'
	console.log "- #{path}" for path in paths

catch error
	console.error if error instanceof Error then error.message else error
