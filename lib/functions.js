'use strict';

/**
 * Finds the first instance of an executable in the system path.
 * @param {string} command The command to be resolved.
 * @param {boolean} [all] Value indicating whether to return all executables found, instead of just the first one.
 * @param {object} [options] The options to be passed to the finder.
 * @return Observable A string, or an array of strings, specifying the path(s) of the found executable(s).
 */
exports.which = function which(command, all = false, options = {}) {
  // TODO
};
