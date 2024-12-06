import {which} from "@cedx/which"
import console from "node:console"

# Finds the first instance of an executable.
try
	path = await which("foobar").first
	console.log "The \"foobar\" command is located at: #{path}"

catch error
	console.error if error instanceof Error then error.message else error
