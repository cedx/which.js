'use strict';
const {Finder} = require('./finder');

/**
 * Finds the first instance of an executable in the system path.
 * @param {string} command The command to be resolved.
 * @param {boolean} [all] Value indicating whether to return all executables found, instead of just the first one.
 * @param {object} [options] The options to be passed to the finder.
 * @return {Promise<string|string[]>} A string, or an array of strings, specifying the path(s) of the found executable(s).
 * @throws {Error} The command was not found.
 */
exports.which = async function which(command, all = false, options = {}) {
  let executables = await new Finder(
    Array.isArray(options.path) || typeof options.path == 'string' ? options.path : '',
    Array.isArray(options.extensions) || typeof options.extensions == 'string' ? options.extensions : '',
    typeof options.pathSeparator == 'string' ? options.pathSeparator : ''
  ).find(command);

  if (!executables.length) throw new Error(`Command not found: ${command}`);
  return all ? executables : executables[0];
};
