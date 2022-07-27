import assert from "node:assert/strict";
import {describe, it} from "node:test";
import which, {Finder} from "../src/index.js";

/**
 * Tests the features of the {@link ResultSet} class.
 */
describe("ResultSet", () => {
	describe(".all()", () => {
		const options = {paths: ["test/fixture"]};

		it("should return the path of the `executable.cmd` file on Windows", async () => {
			const promise = which("executable", options).all();
			if (!Finder.isWindows) assert.rejects(promise);
			else {
				const executables = await promise;
				assert.ok(Array.isArray(executables));
				assert.equal(executables.length, 1);
				assert.equal(typeof executables[0], "string");
				assert.ok(executables[0].endsWith("\\test\\fixture\\executable.cmd"));
			}
		});

		it("should return the path of the `executable.sh` file on POSIX", async () => {
			const promise = which("executable.sh", options).all();
			if (Finder.isWindows) assert.rejects(promise);
			else {
				const executables = await promise;
				assert.ok(Array.isArray(executables));
				assert.equal(executables.length, 1);
				assert.equal(typeof executables[0], "string");
				assert.ok(executables[0].endsWith("/test/fixture/executable.sh"));
			}
		});

		it("should reject if the searched command is not executable or not found", () => {
			assert.rejects(() => which("not_executable.sh", options).all());
			assert.rejects(() => which("foo", options).all());
		});
	});

	describe(".first()", () => {
		const options = {paths: ["test/fixture"]};

		it("should return the path of the `executable.cmd` file on Windows", async () => {
			const promise = which("executable", options).first();
			if (!Finder.isWindows) assert.rejects(promise);
			else {
				const executable = await promise;
				assert.equal(typeof executable, "string");
				assert.ok(executable.endsWith("\\test\\fixture\\executable.cmd"));
			}
		});

		it("should return the path of the `executable.sh` file on POSIX", async () => {
			const promise = which("executable.sh", options).first();
			if (Finder.isWindows) assert.rejects(promise);
			else {
				const executable = await promise;
				assert.equal(typeof executable, "string");
				assert.ok(executable.endsWith("/test/fixture/executable.sh"));
			}
		});

		it("should reject if the searched command is not executable or not found", () => {
			assert.rejects(() => which("not_executable.sh", options).first());
			assert.rejects(() => which("foo", options).first());
		});
	});
});
