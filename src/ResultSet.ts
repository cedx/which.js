import {delimiter} from "node:path";
import {Finder} from "./Finder.js";

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
	 * All instances of the searched command.
	 */
	get all(): Promise<string[]> {
		return this.#all();
	}

	/**
	 * The first instance of the searched command.
	 */
	get first(): Promise<string> {
		return this.stream.next().then(({value}) => {
			if (!value) this.#throw();
			return value;
		});
	}

	/**
	 * A stream of instances of the searched command.
	 */
	get stream(): AsyncGenerator<string, void, void> {
		return this.#finder.find(this.#command);
	}

	/**
	 * Returns all instances of the searched command.
	 * @returns All search results.
	 */
	async #all(): Promise<string[]> {
		const executables = new Set<string>;
		for await (const path of this.stream) executables.add(path);
		if (!executables.size) this.#throw();
		return executables.values().toArray();
	}

	/**
	 * Throws an error indicating that the command was not found.
	 * @throws `Error` when that the command was not found.
	 */
	#throw(): never {
		const paths = Array.from(this.#finder.paths).join(Finder.isWindows ? ";" : delimiter);
		throw Error(`No "${this.#command}" in (${paths}).`);
	}
}
