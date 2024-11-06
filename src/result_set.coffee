import {delimiter} from "node:path";
import {Finder} from "./finder.js";

# Provides convenient access to the stream of search results.
export class ResultSet

	# Creates a new result set.
	constructor: (command, finder) ->

		# The searched command.
		@_command = command

		# The finder used to perform the search.
		@_finder = finder

	# Returns all instances of the searched command.
	all: ->
		executables = new Set
		executables.add path for await path from @stream()
		if executables.size then Array.from executables else
			paths = Array.from(@_finder.paths).join if Finder.isWindows then ";" else delimiter
			throw Error "No \"#{@_command}\" in (#{paths})."

	# Returns the first instance of the searched command.
	first: ->
		{value} = await @stream().next()
		if value then value else
			paths = Array.from(@_finder.paths).join if Finder.isWindows then ";" else delimiter
			throw Error "No \"#{@_command}\" in (#{paths})."

	# Returns a stream of instances of the searched command.
	stream: -> @_finder.find @_command
