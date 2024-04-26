import {Finder} from "./finder.js";
import {ResultSet} from "./result_set.js";

export * from "./finder.js";
export * from "./result_set.js";

/**
 * Finds the instances of the specified command in the system path.
 * @param {string} command The command to be resolved.
 * @param {Partial<import("./finder.js").FinderOptions>} options The options to be passed to the finder.
 * @returns {ResultSet} The search results.
 */
export default function which(command, options = {}) {
	return new ResultSet(command, new Finder(options));
}
