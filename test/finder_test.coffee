import {Finder} from "@cedx/which"
import {equal, ok} from "node:assert/strict"
import {delimiter} from "node:path"
import {env} from "node:process"
import {describe, it} from "node:test"

# Tests the features of the `Finder` class.
describe "Finder", ->
	describe "constructor()", ->
		it "should set the `paths` property to the value of the `PATH` environment variable by default", ->
			pathEnv = env.PATH or ""
			paths = new Set if pathEnv then pathEnv.split(if Finder.isWindows then ";" else delimiter).filter (item) -> item.length else []
			equal new Finder().paths.symmetricDifference(paths).size, 0

		it "should set the `extensions` property to the value of the `PATHEXT` environment variable by default", ->
			pathExt = env.PATHEXT or ""
			extensions = new Set if pathExt then pathExt.split(";").map (item) -> item.toLowerCase() else [".exe", ".cmd", ".bat", ".com"]
			equal new Finder().extensions.symmetricDifference(extensions).size, 0

		it "should put in lower case the list of file extensions", ->
			finder = new Finder extensions: [".EXE", ".JS", ".PS1"]
			equal finder.extensions.symmetricDifference(new Set [".exe", ".js", ".ps1"]).size, 0

	describe "find()", ->
		finder = new Finder paths: ["res"]

		it "should return the path of the `executable.cmd` file on Windows", ->
			executables = await Array.fromAsync finder.find "executable"
			equal executables.length, if Finder.isWindows then 1 else 0
			ok executables[0].endsWith "\\res\\executable.cmd" if Finder.isWindows

		it "should return the path of the `executable.sh` file on POSIX", ->
			executables = await Array.fromAsync finder.find "executable.sh"
			equal executables.length, if Finder.isWindows then 0 else 1
			ok executables[0].endsWith "/res/executable.sh" unless Finder.isWindows

		it "should return an empty array if the searched command is not executable or not found", ->
			executables = await Array.fromAsync finder.find "not_executable.sh"
			equal executables.length, 0
			executables = await Array.fromAsync finder.find "foo"
			equal executables.length, 0

	describe "isExecutable()", ->
		finder = new Finder

		it "should return `false` if the searched command is not executable or not found", ->
			equal await finder.isExecutable("res/not_executable.sh"), no
			equal await finder.isExecutable("foo/bar/baz.qux"), no

		it "should return `false` for a POSIX executable, when test is run on Windows", ->
			equal await finder.isExecutable("res/executable.sh"), not Finder.isWindows

		it "should return `false` for a Windows executable, when test is run on POSIX", ->
			equal await finder.isExecutable("res/executable.cmd"), Finder.isWindows
