'use strict';
const {Finder, FinderError} = require('./finder.js');

/**
 * Finds the first instance of an executable in the system path.
 * Rejects with a `FinderError` if the command was not found.
 * @param {string} command The command to be resolved.
 * @param {object} [options] The options to be passed to the finder.
 * @return {Promise<string|string[]>} A string, or an array of strings, specifying the path(s) of the found executable(s).
 */
async function which(command, {all = false, extensions = '', onError = null, path = '', pathSeparator = ''} = {}) {
  let finder = new Finder({extensions, path, pathSeparator});
  let executables = await finder.find(command, all);
  if (!executables.length) {
    if (typeof onError == 'function') return onError(command);
    throw new FinderError(command, finder, `Command "${command}" not found`);
  }

  return all ? executables : executables[0];
}

// Module exports.
exports.which = which;
