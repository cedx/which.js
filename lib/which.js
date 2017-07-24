'use strict';

const {Observable} = require('rxjs');
const {Finder} = require('./finder');

/**
 * Finds the first instance of an executable in the system path.
 * @param {string} command The command to be resolved.
 * @param {boolean} [all] Value indicating whether to return all executables found, instead of just the first one.
 * @param {object} [options] The options to be passed to the finder.
 * @return {Observable<string|string[]>} A string, or an array of strings, specifying the path(s) of the found executable(s).
 */
exports.which = function which(command, all = false, options = {}) {
  let finder = new Finder(
    Array.isArray(options.path) || typeof options.path == 'string' ? options.path : '',
    Array.isArray(options.extensions) || typeof options.extensions == 'string' ? options.extensions : '',
    typeof options.pathSeparator == 'string' ? options.pathSeparator : ''
  );

  let executables = finder.find(command);
  return executables
    .isEmpty()
    .mergeMap(isEmpty => {
      if (isEmpty) return Observable.throw(new Error(`Command not found: ${command}`));
      return all ? executables.toArray() : executables.take(1);
    });
};
