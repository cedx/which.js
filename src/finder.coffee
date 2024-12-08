import {stat} from "node:fs/promises"
import {delimiter, extname, resolve} from "node:path"
import process from "node:process"

# Finds the instances of an executable in the system path.
export class Finder

	# Creates a new finder.
	constructor: (options = {}) ->
		{extensions = [], paths = []} = options

		unless extensions.length
			pathExt = process.env.PATHEXT or ""
			extensions = if pathExt then pathExt.split ";" else [".exe", ".cmd", ".bat", ".com"]

		unless paths.length
			pathEnv = process.env.PATH or ""
			paths = if pathEnv then pathEnv.split(if Finder.isWindows then ";" else delimiter) else []

		# The list of executable file extensions.
		@extensions = new Set extensions.map (extension) -> extension.toLowerCase()

		# The list of system paths.
		@paths = new Set paths.map((item) -> item.replace /^"|"$/g, "").filter (item) -> item.length

	# Value indicating whether the current platform is Windows.
	Object.defineProperty @, "isWindows", get: -> process.platform is "win32" or process.env.OSTYPE in ["cygwin", "msys"]

	# Finds the instances of an executable in the system path.
	find: (command) ->
		await Promise.resolve()
		yield from @_findExecutables directory, command for directory from @paths
		return

	# Gets a value indicating whether the specified file is executable.
	isExecutable: (file) ->
		try
			fileStats = await stat file
			fileStats.isFile() and (if Finder.isWindows then @_checkFileExtension file else @_checkFilePermissions fileStats)
		catch
			no

	# Checks that the specified file is executable according to the executable file extensions.
	_checkFileExtension: (file) -> @extensions.has extname(file).toLowerCase()

	# Checks that the specified file is executable according to its permissions.
	_checkFilePermissions: (stats) ->
		# Others.
		perms = stats.mode
		if perms & 0o001 then return yes

		# Group.
		gid = if typeof process.getgid is "function" then process.getgid() else -1
		if perms & 0o010 then return gid is stats.gid

		# Owner.
		uid = if typeof process.getuid is "function" then process.getuid() else -1
		if perms & 0o100 then return uid is stats.uid

		# Root.
		if perms & (0o100 | 0o010) then uid is 0 else no

	# Finds the instances of an executable in the specified directory.
	_findExecutables: (directory, command) ->
		extensions = if Finder.isWindows then @extensions else new Set
		for extension from ["", extensions...]
			resolvedPath = resolve directory, "#{command}#{extension}"
			yield resolvedPath if await @isExecutable resolvedPath
		return
