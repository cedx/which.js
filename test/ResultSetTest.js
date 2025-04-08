import {Finder, which} from "@cedx/which";
import {equal, ok, rejects} from "node:assert/strict";
import {describe, it} from "node:test";

/**
 * Tests the features of the {@link ResultSet} class.
 */
describe("ResultSet", () => {
	describe("all", () => {
		const options = {paths: ["res"]};

		it("should return the path of the `Executable.cmd` file on Windows", async () => {
			const promise = which("Executable", options).all;
			if (!Finder.isWindows) await rejects(promise);
			else {
				const executables = await promise;
				ok(Array.isArray(executables));
				equal(executables.length, 1);
				equal(typeof executables[0], "string");
				ok(executables[0].endsWith("\\res\\Executable.cmd"));
			}
		});

		it("should return the path of the `Executable.sh` file on POSIX", async () => {
			const promise = which("Executable.sh", options).all;
			if (Finder.isWindows) await rejects(promise);
			else {
				const executables = await promise;
				ok(Array.isArray(executables));
				equal(executables.length, 1);
				equal(typeof executables[0], "string");
				ok(executables[0].endsWith("/res/Executable.sh"));
			}
		});

		it("should reject if the searched command is not executable or not found", async () => {
			await rejects(() => which("NotExecutable.sh", options).all);
			return rejects(() => which("foo", options).all);
		});
	});

	describe("first", () => {
		const options = {paths: ["res"]};

		it("should return the path of the `Executable.cmd` file on Windows", async () => {
			const promise = which("Executable", options).first;
			if (!Finder.isWindows) await rejects(promise);
			else {
				const executable = await promise;
				equal(typeof executable, "string");
				ok(executable.endsWith("\\res\\Executable.cmd"));
			}
		});

		it("should return the path of the `Executable.sh` file on POSIX", async () => {
			const promise = which("Executable.sh", options).first;
			if (Finder.isWindows) await rejects(promise);
			else {
				const executable = await promise;
				equal(typeof executable, "string");
				ok(executable.endsWith("/res/Executable.sh"));
			}
		});

		it("should reject if the searched command is not executable or not found", async () => {
			await rejects(() => which("NotExecutable.sh", options).first);
			return rejects(() => which("foo", options).first);
		});
	});
});
