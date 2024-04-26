import {stat} from "node:fs/promises";
import {delimiter, extname, resolve} from "node:path";
import process from "node:process";

/**
 * Finds the instances of an executable in the system path.
 */
export class Finder {

	/**
	 * The list of executable file extensions.
	 * @type {string[]}
	 * @readonly
	 */
	extensions;

	/**
	 * The list of system paths.
	 * @type {string[]}
	 * @readonly
	 */
	paths;

	/**
	 * Creates a new finder.
	 * @param {Partial<FinderOptions>} options An object providing values to initialize this instance.
	 */
	constructor(options = {}) {
		let {extensions = [], paths = []} = options;

		if (!extensions.length) {
			const pathExt = process.env.PATHEXT ?? "";
			extensions = pathExt ? pathExt.split(";") : [".exe", ".cmd", ".bat", ".com"];
		}

		if (!paths.length) {
			const pathEnv = process.env.PATH ?? "";
			paths = pathEnv ? pathEnv.split(Finder.isWindows ? ";" : delimiter) : [];
		}

		this.extensions = extensions.map(extension => extension.toLowerCase());
		this.paths = paths.map(item => item.replace(/^"|"$/g, "")).filter(item => item.length);
	}

	/**
	 * Value indicating whether the current platform is Windows.
	 * @type {boolean}
	 */
	static get isWindows() {
		return process.platform == "win32" || ["cygwin", "msys"].includes(process.env.OSTYPE ?? "");
	}

	/**
	 * Finds the instances of an executable in the system path.
	 * @param {string} command The command to be resolved.
	 * @returns {AsyncGenerator<string, void>} The paths of the executables found.
	 */
	async *find(command) {
		for (const directory of this.paths) yield* this.#findExecutables(directory, command);
	}

	/**
	 * Gets a value indicating whether the specified file is executable.
	 * @param {string} file The path of the file to be checked.
	 * @returns {Promise<boolean>} `true` if the specified file is executable, otherwise `false`.
	 */
	async isExecutable(file) {
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
	 * @param {string} file The path of the file to be checked.
	 * @returns {boolean} `true` if the specified file is executable, otherwise `false`.
	 */
	#checkFileExtension(file) {
		return this.extensions.includes(extname(file).toLowerCase());
	}

	/**
	 * Checks that the specified file is executable according to its permissions.
	 * @param {import("node:fs").Stats} stats A reference to the file to be checked.
	 * @returns {boolean} `true` if the specified file is executable, otherwise `false`.
	 */
	#checkFilePermissions(stats) {
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
	 * @param {string} directory The directory path.
	 * @param {string} command The command to be resolved.
	 * @returns {AsyncGenerator<string, void>} The paths of the executables found.
	 */
	async *#findExecutables(directory, command) {
		for (const extension of ["", ...Finder.isWindows ? this.extensions : []]) {
			const resolvedPath = resolve(directory, `${command}${extension}`);
			if (await this.isExecutable(resolvedPath)) yield resolvedPath;
		}
	}
}

/**
 * Defines the options of a {@link Finder} instance.
 * @typedef {object} FinderOptions
 * @property {string[]} extensions The list of executable file extensions.
 * @property {string[]} paths The list of system paths.
 */
