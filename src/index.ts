export * from "./finder.js";
export * from "./result_set.js";
import {Finder, type FinderOptions} from "./finder.js";
import {ResultSet} from "./result_set.js";

/**
 * Finds the instances of the specified command in the system path.
 * @param command The command to be resolved.
 * @param options The options to be passed to the finder.
 * @returns The search results.
 */
export default function which(command: string, options: Partial<FinderOptions> = {}): ResultSet {
	return new ResultSet(command, new Finder(options));
}
