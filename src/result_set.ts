import {delimiter} from "node:path";
import {Finder} from "./finder.js";

/**
 * Provides convenient access to the stream of search results.
 */
export class ResultSet {

	/**
	 * The searched command.
	 */
	readonly #command: string;

	/**
	 * The finder used to perform the search.
	 */
	readonly #finder: Finder;

	/**
	 * Creates a new result set.
	 * @param command The searched command.
	 * @param finder The finder used to perform the search.
	 */
	constructor(command: string, finder: Finder) {
		this.#command = command;
		this.#finder = finder;
	}

	/**
	 * Returns all instances of the searched command.
	 * @returns All search results.
	 */
	async all(): Promise<string[]> {
		const executables = new Set<string>;
		for await (const path of this.stream()) executables.add(path);
		if (executables.size) return Array.from(executables);
		throw Error(`No "${this.#command}" in (${Array.from(this.#finder.paths).join(Finder.isWindows ? ";" : delimiter)}).`);
	}

	/**
	 * Returns the first instance of the searched command.
	 * @returns The first search result.
	 */
	async first(): Promise<string> {
		const {value} = await this.stream().next();
		if (value) return value;
		throw Error(`No "${this.#command}" in (${Array.from(this.#finder.paths).join(Finder.isWindows ? ";" : delimiter)}).`);
	}

	/**
	 * Returns a stream of instances of the searched command.
	 * @returns A stream of the search results.
	 */
	stream(): AsyncGenerator<string, void> {
		return this.#finder.find(this.#command);
	}
}
