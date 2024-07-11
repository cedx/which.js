import {equal, notEqual, ok} from "node:assert/strict";
import {delimiter} from "node:path";
import {env} from "node:process";
import {describe, it} from "node:test";
import {Finder} from "@cedx/which";

/**
 * Tests the features of the {@link Finder} class.
 */
describe("Finder", () => {
	describe("constructor()", () => {
		it("should set the `paths` property to the value of the `PATH` environment variable by default", () => {
			const pathEnv = env.PATH ?? "";
			const paths = new Set(pathEnv ? pathEnv.split(Finder.isWindows ? ";" : delimiter).filter(item => item.length > 0) : []);
			equal(new Finder().paths.symmetricDifference(paths).size, 0);
		});

		it("should set the `extensions` property to the value of the `PATHEXT` environment variable by default", () => {
			const pathExt = env.PATHEXT ?? "";
			const extensions = new Set(pathExt ? pathExt.split(";").map(item => item.toLowerCase()) : [".exe", ".cmd", ".bat", ".com"]);
			equal(new Finder().extensions.symmetricDifference(extensions).size, 0);
		});

		it("should put in lower case the list of file extensions", () =>
			equal(new Finder({extensions: [".EXE", ".JS", ".PS1"]}).extensions.symmetricDifference(new Set([".exe", ".js", ".ps1"])).size, 0));
	});

	describe("find()", () => {
		const finder = new Finder({paths: ["res"]});

		it("should return the path of the `executable.cmd` file on Windows", async () => {
			const executables = await generatorToArray(finder.find("executable"));
			equal(executables.length, Finder.isWindows ? 1 : 0);
			if (Finder.isWindows) ok(executables[0].endsWith("\\res\\executable.cmd"));
		});

		it("should return the path of the `executable.sh` file on POSIX", async () => {
			const executables = await generatorToArray(finder.find("executable.sh"));
			equal(executables.length, Finder.isWindows ? 0 : 1);
			if (!Finder.isWindows) ok(executables[0].endsWith("/res/executable.sh"));
		});

		it("should return an empty array if the searched command is not executable or not found", async () => {
			let executables = await generatorToArray(finder.find("not_executable.sh"));
			equal(executables.length, 0);
			executables = await generatorToArray(finder.find("foo"));
			equal(executables.length, 0);
		});
	});

	describe("isExecutable()", () => {
		const finder = new Finder;

		it("should return `false` if the searched command is not executable or not found", async () => {
			equal(await finder.isExecutable("res/not_executable.sh"), false);
			equal(await finder.isExecutable("foo/bar/baz.qux"), false);
		});

		it("should return `false` for a POSIX executable, when test is run on Windows", async () =>
			notEqual(await finder.isExecutable("res/executable.sh"), Finder.isWindows));

		it("should return `false` for a Windows executable, when test is run on POSIX", async () =>
			equal(await finder.isExecutable("res/executable.cmd"), Finder.isWindows));
	});
});

/**
 * Converts the specified generator to an array.
 * @param {AsyncGenerator<string>} generator A generator.
 * @returns {Promise<string[]>} The array corresponding to the specified generator.
 */
async function generatorToArray(generator) {
	const items = [];
	for await (const item of generator) items.push(item);
	return items;
}
