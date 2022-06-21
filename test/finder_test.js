import assert from "node:assert/strict";
import {delimiter} from "node:path";
import {env} from "node:process";
import test from "node:test";
import {Finder} from "../lib/index.js";

test("Finder.constructor", async ctx => {
	await ctx.test("should set the `paths` property to the value of the `PATH` environment variable by default", () => {
		const pathEnv = env.PATH ?? "";
		const paths = pathEnv ? pathEnv.split(Finder.isWindows ? ";" : delimiter) : [];
		assert.deepEqual(new Finder().paths, paths);
	});

	await ctx.test("should set the `extensions` property to the value of the `PATHEXT` environment variable by default", () => {
		const pathExt = env.PATHEXT ?? "";
		const extensions = pathExt ? pathExt.split(";").map(item => item.toLowerCase()) : [".exe", ".cmd", ".bat", ".com"];
		assert.deepEqual(new Finder().extensions, extensions);
	});

	await ctx.test("should put in lower case the list of file extensions", () => {
		assert.deepEqual(new Finder({extensions: [".EXE", ".JS", ".PS1"]}).extensions, [".exe", ".js", ".ps1"]);
	});
});

test("Finder.find()", async ctx => {
	const finder = new Finder({paths: ["test/fixture"]});

	async function toArray(/** @type {AsyncIterable<string>} */ asyncIterable) {
		const items = [];
		for await (const item of asyncIterable) items.push(item);
		return items;
	}

	await ctx.test("should return the path of the `executable.cmd` file on Windows", async () => {
		const executables = await toArray(finder.find("executable"));
		assert.equal(executables.length, Finder.isWindows ? 1 : 0);
		if (Finder.isWindows) assert.ok(executables[0].endsWith("\\test\\fixture\\executable.cmd"));
	});

	await ctx.test("should return the path of the `executable.sh` file on POSIX", async () => {
		const executables = await toArray(finder.find("executable.sh"));
		assert.equal(executables.length, Finder.isWindows ? 0 : 1);
		if (!Finder.isWindows) assert.ok(executables[0].endsWith("/test/fixture/executable.sh"));
	});

	await ctx.test("should return an empty array if the searched command is not executable or not found", async () => {
		let executables = await toArray(finder.find("not_executable.sh"));
		assert.equal(executables.length, 0);
		executables = await toArray(finder.find("foo"));
		assert.equal(executables.length, 0);
	});
});

test("Finder.isExecutable()", async ctx => {
	const finder = new Finder;

	await ctx.test("should return `false` if the searched command is not executable or not found", async () => {
		assert.equal(await finder.isExecutable("test/fixture/not_executable.sh"), false);
		assert.equal(await finder.isExecutable("foo/bar/baz.qux"), false);
	});

	await ctx.test("should return `false` for a POSIX executable, when test is run on Windows", async () => {
		assert.notEqual(await finder.isExecutable("test/fixture/executable.sh"), Finder.isWindows);
	});

	await ctx.test("should return `false` for a Windows executable, when test is run on POSIX", async () => {
		assert.equal(await finder.isExecutable("test/fixture/executable.cmd"), Finder.isWindows);
	});
});
