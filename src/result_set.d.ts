import {Finder} from "./finder.js";

/**
 * Provides convenient access to the stream of search results.
 */
export class ResultSet {

	/**
	 * Creates a new result set.
	 * @param command The searched command.
	 * @param finder The finder used to perform the search.
	 */
	constructor(command: string, finder: Finder);

	/**
	 * Returns all instances of the searched command.
	 * @returns All search results.
	 */
	all(): Promise<Array<string>>;

	/**
	 * Returns the first instance of the searched command.
	 * @returns The first search result.
	 */
	first(): Promise<string>;

	/**
	 * Returns a stream of instances of the searched command.
	 * @returns A stream of the search results.
	 */
	stream(): AsyncGenerator<string, void>;
}
