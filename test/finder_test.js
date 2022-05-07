import assert from "node:assert/strict";
import {delimiter} from "node:path";
import {Finder} from "../lib/index.js";

/**
 * Tests the features of the {@link Finder} class.
 */
describe("Finder", () => {
	describe("constructor", () => {
		it("should set the `paths` property to the value of the `PATH` environment variable by default", () => {
			const pathEnv = process.env.PATH ?? "";
			const paths = pathEnv.length ? pathEnv.split(Finder.isWindows ? ";" : delimiter) : [];
			assert.deepEqual(new Finder().paths, paths);
		});

		it("should set the `extensions` property to the value of the `PATHEXT` environment variable by default", () => {
			const pathExt = process.env.PATHEXT ?? "";
			const extensions = pathExt.length ? pathExt.split(";").map(item => item.toLowerCase()) : [".exe", ".cmd", ".bat", ".com"];
			assert.deepEqual(new Finder().extensions, extensions);
		});

		it("should put in lower case the list of file extensions", () => {
			assert.deepEqual(new Finder({extensions: [".EXE", ".JS", ".PS1"]}).extensions, [".exe", ".js", ".ps1"]);
		});
	});

	describe(".find()", () => {
		const finder = new Finder({paths: ["test/fixture"]});

		async function toArray(/** @type {AsyncIterable<string>} */ asyncIterable) {
			const items = [];
			for await (const item of asyncIterable) items.push(item);
			return items;
		}

		it("should return the path of the `executable.cmd` file on Windows", async () => {
			const executables = await toArray(finder.find("executable"));
			assert.equal(executables.length, Finder.isWindows ? 1 : 0);
			if (Finder.isWindows) assert.ok(executables[0].endsWith("\\test\\fixture\\executable.cmd"));
		});

		it("should return the path of the `executable.sh` file on POSIX", async () => {
			const executables = await toArray(finder.find("executable.sh"));
			assert.equal(executables.length, Finder.isWindows ? 0 : 1);
			if (!Finder.isWindows) assert.ok(executables[0].endsWith("/test/fixture/executable.sh"));
		});

		it("should return an empty array if the searched command is not executable or not found", async () => {
			let executables = await toArray(finder.find("not_executable.sh"));
			assert.equal(executables.length, 0);
			executables = await toArray(finder.find("foo"));
			assert.equal(executables.length, 0);
		});
	});

	describe(".isExecutable()", () => {
		const finder = new Finder;

		it("should return `false` if the searched command is not executable or not found", async () => {
			assert.equal(await finder.isExecutable("test/fixture/not_executable.sh"), false);
			assert.equal(await finder.isExecutable("foo/bar/baz.qux"), false);
		});

		it("should return `false` for a POSIX executable, when test is run on Windows", async () => {
			assert.notEqual(await finder.isExecutable("test/fixture/executable.sh"), Finder.isWindows);
		});

		it("should return `false` for a Windows executable, when test is run on POSIX", async () => {
			assert.equal(await finder.isExecutable("test/fixture/executable.cmd"), Finder.isWindows);
		});
	});
});
