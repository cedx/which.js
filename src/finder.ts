import type {Stats} from "node:fs";
import {stat} from "node:fs/promises";
import {delimiter, extname, resolve} from "node:path";
import process from "node:process";

/**
 * Finds the instances of an executable in the system path.
 */
export class Finder {

	/**
	 * The list of executable file extensions.
	 */
	readonly extensions: Set<string>;

	/**
	 * The list of system paths.
	 */
	readonly paths: Set<string>;

	/**
	 * Creates a new finder.
	 * @param options An object providing values to initialize this instance.
	 */
	constructor(options: Partial<FinderOptions> = {}) {
		let {extensions = [], paths = []} = options;

		if (!extensions.length) {
			const pathExt = process.env.PATHEXT ?? "";
			extensions = pathExt ? pathExt.split(";") : [".exe", ".cmd", ".bat", ".com"];
		}

		if (!paths.length) {
			const pathEnv = process.env.PATH ?? "";
			paths = pathEnv ? pathEnv.split(Finder.isWindows ? ";" : delimiter) : [];
		}

		this.extensions = new Set(extensions.map(extension => extension.toLowerCase()));
		this.paths = new Set(paths.map(item => item.replace(/^"|"$/g, "")).filter(item => item.length));
	}

	/**
	 * Value indicating whether the current platform is Windows.
	 */
	static get isWindows(): boolean {
		return process.platform == "win32" || ["cygwin", "msys"].includes(process.env.OSTYPE ?? "");
	}

	/**
	 * Finds the instances of an executable in the system path.
	 * @param command The command to be resolved.
	 * @returns The paths of the executables found.
	 */
	async *find(command: string): AsyncGenerator<string, void> {
		for (const directory of this.paths) yield* this.#findExecutables(directory, command);
	}

	/**
	 * Gets a value indicating whether the specified file is executable.
	 * @param file The path of the file to be checked.
	 * @returns `true` if the specified file is executable, otherwise `false`.
	 */
	async isExecutable(file: string): Promise<boolean> {
		try {
			const fileStats = await stat(file);
			return fileStats.isFile() && (Finder.isWindows ? this.#checkFileExtension(file) : this.#checkFilePermissions(fileStats));
		}
		catch {
			return false;
		}
	}

	/**
	 * Checks that the specified file is executable according to the executable file extensions.
	 * @param file The path of the file to be checked.
	 * @returns `true` if the specified file is executable, otherwise `false`.
	 */
	#checkFileExtension(file: string): boolean {
		return this.extensions.has(extname(file).toLowerCase());
	}

	/**
	 * Checks that the specified file is executable according to its permissions.
	 * @param stats A reference to the file to be checked.
	 * @returns `true` if the specified file is executable, otherwise `false`.
	 */
	#checkFilePermissions(stats: Stats): boolean {
		// Others.
		const perms = stats.mode;
		if (perms & 0o001) return true;

		// Group.
		const gid = typeof process.getgid == "function" ? process.getgid() : -1;
		if (perms & 0o010) return gid == stats.gid;

		// Owner.
		const uid = typeof process.getuid == "function" ? process.getuid() : -1;
		if (perms & 0o100) return uid == stats.uid;

		// Root.
		return perms & (0o100 | 0o010) ? uid == 0 : false;
	}

	/**
	 * Finds the instances of an executable in the specified directory.
	 * @param directory The directory path.
	 * @param command The command to be resolved.
	 * @returns The paths of the executables found.
	 */
	async *#findExecutables(directory: string, command: string): AsyncGenerator<string, void> {
		for (const extension of ["", ...Finder.isWindows ? this.extensions : new Set<string>]) {
			const resolvedPath = resolve(directory, `${command}${extension}`);
			if (await this.isExecutable(resolvedPath)) yield resolvedPath;
		}
	}
}

/**
 * Defines the options of a {@link Finder} instance.
 */
export interface FinderOptions {

	/**
	 * The list of executable file extensions.
	 */
	extensions: Array<string>;

	/**
	 * The list of system paths.
	 */
	paths: Array<string>;
}
