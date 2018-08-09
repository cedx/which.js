import {Finder, FinderError, FinderOptions} from './finder';

/**
 * Finds the first instance of an executable in the system path.
 * Rejects with a `FinderError` if the command was not found.
 * @param command The command to be resolved.
 * @param [options] The options to be passed to the finder.
 * @return A string, or an array of strings, specifying the path(s) of the found executable(s).
 */
export async function which(command: string, options: WhichOptions = {}): Promise<string | string[]> {
  const {all = false, extensions = '', onError = null, path = '', pathSeparator = ''} = options;

  const finder = new Finder({extensions, path, pathSeparator});
  const executables = await finder.find(command, all);
  if (!executables.length) {
    if (onError) return onError(command);
    throw new FinderError(command, finder, `Command "${command}" not found`);
  }

  return all ? executables : executables[0];
}

/**
 * Defines the options of the `which()` function.
 */
export interface WhichOptions extends FinderOptions {

  /**
   * Value indicating whether to return an array of all executables found, instead of just the first one.
   */
  all?: boolean;

  /**
   * An optional error handler.
   * It is called with the command as argument, and its return value is used instead.
   */
  onError?: (command: string) => any;
}