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
				ok(executable.endsWith("\\res\\Executable.cmd"));
			}
		});

		it("should return the path of the `Executable.sh` file on POSIX", async () => {
			const promise = which("Executable.sh", options).first;
			if (Finder.isWindows) await rejects(promise);
			else {
				const executable = await promise;
				ok(executable.endsWith("/res/Executable.sh"));
			}
		});

		it("should reject if the searched command is not executable or not found", async () => {
			await rejects(() => which("NotExecutable.sh", options).first);
			return rejects(() => which("foo", options).first);
		});
	});

	describe("[Symbol.asyncIterator]()", () => {
		const options = {paths: ["res"]};

		it("should return the path of the `Executable.cmd` file on Windows", async () => {
			let found = false;
			for await (const executable of which("Executable", options)) {
				ok(executable.endsWith("\\res\\Executable.cmd"));
				found = true;
			}

			equal(found, Finder.isWindows);
		});

		it("should return the path of the `Executable.sh` file on POSIX", async () => {
			let found = false;
			for await (const executable of which("Executable.sh", options)) {
				ok(executable.endsWith("/res/Executable.sh"));
				found = true;
			}

			equal(found, !Finder.isWindows);
		});

		it("should not return any result if the searched command is not executable or not found", async () => {
			let found = false;
			for await (const _ of which("NotExecutable.sh", options)); // eslint-disable-line @typescript-eslint/no-unused-vars
			ok(!found);

			found = false;
			for await (const _ of which("foo", options)); // eslint-disable-line @typescript-eslint/no-unused-vars
			ok(!found);
		});
	});
});
