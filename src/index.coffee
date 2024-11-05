import {Finder} from "./finder.js"
import {ResultSet} from "./result_set.js"
export * from "./finder.js"
export * from "./result_set.js"

# Finds the instances of the specified command in the system path.
export which = (command, options = {}) -> new ResultSet command, new Finder(options)
