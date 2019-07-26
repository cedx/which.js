import {Finder, FinderError} from './finder.js';

/**
 * The function invoked when a command is not found by the {@link which} function.
 * @callback WhichErrorHandler
 * @param {string} command The command to resolve.
 * @return {*} The value to return.
 */

/**
 * Defines the options of the {@link which} function.
 * @typedef {object} WhichOptions
 * @property {boolean} [all] Value indicating whether to return an array of all executables found, instead of just the first one.
 * @property {string|string[]} [extensions] The list of executable file extensions.
 * @property {WhichErrorHandler} [onError] An optional error handler.
 * @property {string|string[]} [path] The list of system paths.
 * @property {string} [pathSeparator] The character used to separate paths in the system path.
 */

/**
 * Finds the first instance of an executable in the system path.
 * Rejects with a {@link FinderError} if the command was not found.
 * @param {string} command The command to be resolved.
 * @param {WhichOptions} [options] The options to be passed to the finder.
 * @return {Promise<string|string[]>} A string, or an array of strings, specifying the path(s) of the found executable(s).
 */
export async function which(command, options = {}) {
  const {all = false, extensions = [], onError = null, path = [], pathSeparator = ''} = options;
  const finder = new Finder({extensions, path, pathSeparator});
  const list = [];

  for await (const executable of finder.find(command)) {
    if (!all) return executable;
    list.push(executable);
  }

  if (!list.length) {
    if (onError) return onError(command);
    throw new FinderError(command, finder, `Command "${command}" not found`);
  }

  return [...new Set(list)];
}
