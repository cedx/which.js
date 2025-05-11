import {Finder, type FinderOptions} from "./Finder.js";
import {ResultSet} from "./ResultSet.js";
export * from "./Finder.js";
export * from "./ResultSet.js";

/**
 * Finds the instances of the specified command in the system path.
 * @param command The command to be resolved.
 * @param options The options to be passed to the finder.
 * @returns The search results.
 */
export function which(command: string, options: FinderOptions = {}): ResultSet {
	return new ResultSet(command, new Finder(options));
}
