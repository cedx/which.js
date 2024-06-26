import {delimiter} from "node:path";
import {Finder} from "./finder.js";

/**
 * Provides convenient access to the stream of search results.
 */
export class ResultSet {

	/**
	 * The searched command.
	 * @type {string}
	 * @readonly
	 */
	#command;

	/**
	 * The finder used to perform the search.
	 * @type {Finder}
	 * @readonly
	 */
	#finder;

	/**
	 * Creates a new result set.
	 * @param {string} command The searched command.
	 * @param {Finder} finder The finder used to perform the search.
	 */
	constructor(command, finder) {
		this.#command = command;
		this.#finder = finder;
	}

	/**
	 * Returns all instances of the searched command.
	 * @returns {Promise<string[]>} All search results.
	 */
	async all() {
		/** @type {string[]} */ const executables = [];
		for await (const path of this.stream()) if (!executables.includes(path)) executables.push(path);
		if (executables.length) return executables;
		throw Error(`No "${this.#command}" in (${this.#finder.paths.join(Finder.isWindows ? ";" : delimiter)}).`);
	}

	/**
	 * Returns the first instance of the searched command.
	 * @returns {Promise<string>} The first search result.
	 */
	async first() {
		const {value} = await this.stream().next();
		if (value) return value;
		throw Error(`No "${this.#command}" in (${this.#finder.paths.join(Finder.isWindows ? ";" : delimiter)}).`);
	}

	/**
	 * Returns a stream of instances of the searched command.
	 * @returns {AsyncGenerator<string, void>} A stream of the search results.
	 */
	stream() {
		return this.#finder.find(this.#command);
	}
}
