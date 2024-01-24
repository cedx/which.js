import {equal, ok, rejects} from "node:assert/strict";
import {describe, it} from "node:test";
import which, {Finder} from "#which";

/**
 * Tests the features of the {@link ResultSet} class.
 */
describe("ResultSet", () => {
	describe("all()", () => {
		const options = {paths: ["res"]};

		it("should return the path of the `executable.cmd` file on Windows", async () => {
			const promise = which("executable", options).all();
			if (!Finder.isWindows) rejects(promise);
			else {
				const executables = await promise;
				ok(Array.isArray(executables));
				equal(executables.length, 1);
				equal(typeof executables[0], "string");
				ok(executables[0].endsWith("\\res\\executable.cmd"));
			}
		});

		it("should return the path of the `executable.sh` file on POSIX", async () => {
			const promise = which("executable.sh", options).all();
			if (Finder.isWindows) rejects(promise);
			else {
				const executables = await promise;
				ok(Array.isArray(executables));
				equal(executables.length, 1);
				equal(typeof executables[0], "string");
				ok(executables[0].endsWith("/res/executable.sh"));
			}
		});

		it("should reject if the searched command is not executable or not found", () => {
			rejects(() => which("not_executable.sh", options).all());
			rejects(() => which("foo", options).all());
		});
	});

	describe("first()", () => {
		const options = {paths: ["res"]};

		it("should return the path of the `executable.cmd` file on Windows", async () => {
			const promise = which("executable", options).first();
			if (!Finder.isWindows) rejects(promise);
			else {
				const executable = await promise;
				equal(typeof executable, "string");
				ok(executable.endsWith("\\res\\executable.cmd"));
			}
		});

		it("should return the path of the `executable.sh` file on POSIX", async () => {
			const promise = which("executable.sh", options).first();
			if (Finder.isWindows) rejects(promise);
			else {
				const executable = await promise;
				equal(typeof executable, "string");
				ok(executable.endsWith("/res/executable.sh"));
			}
		});

		it("should reject if the searched command is not executable or not found", () => {
			rejects(() => which("not_executable.sh", options).first());
			rejects(() => which("foo", options).first());
		});
	});
});
