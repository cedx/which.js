import assert from "assert/strict";
import {Finder, FinderError, which} from "../lib/index.js";

/** Tests the features of the `which()` function. */
describe("which()", function() {
	it("should return the path of the `executable.cmd` file on Windows", async function() {
		try {
			const executable = await which("executable", {all: false, path: "test/fixtures"});
			if (Finder.isWindows) assert(executable.endsWith(String.raw`\test\fixtures\executable.cmd`));
			else assert.fail("Error not thrown");
		}

		catch (error) {
			if (Finder.isWindows) assert.fail(error.message);
			else assert(error instanceof FinderError);
		}
	});

	it("should return all the paths of the `executable.cmd` file on Windows", async function() {
		try {
			const executables = await which("executable", {all: true, path: "test/fixtures"});
			if (!Finder.isWindows) assert.fail("Error not thrown");
			else {
				assert(Array.isArray(executables));
				assert.equal(executables.length, 1);
				assert.equal(typeof executables[0], "string");
				assert(executables[0].endsWith(String.raw`\test\fixtures\executable.cmd`));
			}
		}

		catch (error) {
			if (Finder.isWindows) assert.fail(error.message);
			else assert(error instanceof FinderError);
		}
	});

	it("should return the path of the `executable.sh` file on POSIX", async function() {
		try {
			const executable = await which("executable.sh", {all: false, path: "test/fixtures"});
			if (Finder.isWindows) assert.fail("Error not thrown");
			else assert(executable.endsWith("/test/fixtures/executable.sh"));
		}

		catch (error) {
			if (Finder.isWindows) assert(error instanceof FinderError);
			else assert.fail(error.message);
		}
	});

	it("should return all the paths of the `executable.sh` file on POSIX", async function() {
		try {
			const executables = await which("executable.sh", {all: true, path: "test/fixtures"});
			if (Finder.isWindows) assert.fail("Error not thrown");
			else {
				assert(Array.isArray(executables));
				assert.equal(executables.length, 1);
				assert.equal(typeof executables[0], "string");
				assert.match(executables[0], /\/test\/fixtures\/executable\.sh$/);
			}
		}

		catch (error) {
			if (Finder.isWindows) assert(error instanceof FinderError);
			else assert.fail(error.message);
		}
	});

	it("should return the value of the `onError` handler", async function() {
		const executable = await which("executable", {all: false, onError: () => "foo", path: "test/fixtures"});
		if (!Finder.isWindows) assert.equal(executable, "foo");

		const executables = await which("executable.sh", {all: true, onError: () => ["foo"], path: "test/fixtures"});
		if (Finder.isWindows) {
			assert(Array.isArray(executables));
			assert.equal(executables.length, 1);
			assert.equal(executables[0], "foo");
		}
	});
});
