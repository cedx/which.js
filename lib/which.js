import { Finder, FinderError } from "./finder.js";
/**
 * Finds the first instance of an executable in the system path.
 * Rejects with a [[FinderError]] if the command was not found.
 * @param command The command to be resolved.
 * @param options The options to be passed to the finder.
 * @return A string, or an array of strings, specifying the path(s) of the found executable(s).
 */
export async function which(command, options = {}) {
    const { all = false, extensions = [], onError, path = [], pathSeparator = "" } = options;
    const finder = new Finder({ extensions, path, pathSeparator });
    const list = [];
    for await (const executable of finder.find(command)) {
        if (!all)
            return executable;
        list.push(executable);
    }
    if (!list.length) {
        if (onError)
            return onError(command);
        throw new FinderError(command, finder, `Command "${command}" not found`);
    }
    return [...new Set(list)];
}
