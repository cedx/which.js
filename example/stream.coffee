import {which} from "@cedx/which"
import console from "node:console"

# Finds all instances of an executable and returns them one at a time.
try
	stream = which("foobar").stream()
	console.log 'The "foobar" command is available at these locations:'
	console.log "- #{path}" for await path from stream

catch error
	console.error if error instanceof Error then error.message else error
