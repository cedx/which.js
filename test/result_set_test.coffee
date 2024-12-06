import {Finder, which} from "@cedx/which"
import {equal, ok, rejects} from "node:assert/strict"
import {describe, it} from "node:test"

# Tests the features of the `ResultSet` class.
describe "ResultSet", ->
	options = paths: ["res"]

	describe "all", ->
		it "should return the path of the `executable.cmd` file on Windows", ->
			promise = which("executable", options).all
			unless Finder.isWindows then await rejects promise
			else
				executables = await promise
				ok Array.isArray executables
				equal executables.length, 1
				equal typeof executables[0], "string"
				ok executables[0].endsWith "\\res\\executable.cmd"

		it "should return the path of the `executable.sh` file on POSIX", ->
			promise = which("executable.sh", options).all
			if Finder.isWindows then await rejects promise
			else
				executables = await promise
				ok Array.isArray executables
				equal executables.length, 1
				equal typeof executables[0], "string"
				ok executables[0].endsWith "/res/executable.sh"

		it "should reject if the searched command is not executable or not found", ->
			await rejects -> which("not_executable.sh", options).all
			await rejects -> which("foo", options).all

	describe "first", ->
		it "should return the path of the `executable.cmd` file on Windows", ->
			promise = which("executable", options).first
			unless Finder.isWindows then await rejects promise
			else
				executable = await promise
				equal typeof executable, "string"
				ok executable.endsWith "\\res\\executable.cmd"

		it "should return the path of the `executable.sh` file on POSIX", ->
			promise = which("executable.sh", options).first
			if Finder.isWindows then await rejects promise
			else
				executable = await promise
				equal typeof executable, "string"
				ok executable.endsWith "/res/executable.sh"

		it "should reject if the searched command is not executable or not found", ->
			await rejects which("not_executable.sh", options).first
			await rejects which("foo", options).first
