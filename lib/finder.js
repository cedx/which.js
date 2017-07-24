'use strict';

const {stats} = require('fs');
const {join, resolve, sep: pathSep} = require('path');
const {Observable} = require('rxjs');

/**
 * Value indicating whether the current platform is Windows.
 * @type {boolean}
 */
const IS_WINDOWS = process.platform == 'win32' ?
  true :
  process.OSTYPE == 'cygwin' || process.OSTYPE == 'msys';

/**
 * Finds the instances of an executable in the system path.
 */
exports.Finder = class Finder {

  /**
   * Gets a value indicating whether the current platform is Windows.
   * @return {boolean} `true` if the current platform is Windows, otherwise `false`.
   */
  static get isWindows() {
    return IS_WINDOWS;
  }

  /**
   * Initializes a new instance of the class.
   * @param {string|string[]} [path] The system path. Defaults to the `PATH` environment variable.
   * @param {string|string[]} [extensions] The executable file extensions. Defaults to the `PATHEXT` environment variable.
   * @param {string} [pathSeparator] The character used to separate paths in the system path. Defaults to the `path.sep` constant.
   */
  constructor(path = '', extensions = '', pathSeparator = '') {
    if (!pathSeparator.length) pathSeparator = Finder.isWindows ? ';' : pathSep;

    if (!Array.isArray(path)) path = path.length ? path.split(pathSeparator) : [];
    if (!path.length && 'PATH' in process.env) {
      let pathEnv = process.env.PATH;
      if (pathEnv.length) path = pathEnv.split(pathSeparator);
    }

    if (!Array.isArray(extensions)) extensions = extensions.length ? extensions.split(pathSeparator) : [];
    if (!extensions.length && 'PATHEXT' in process.env) {
      let pathExt = process.env.PATHEXT;
    }

    /**
     * The list of executable file extensions.
     * @type {string[]}
     */
    this.extensions = [];

    /**
     * The list of system paths.
     * @type {string[]}
     */
    this.path = path.map(directory => directory.replace(/^"+|"+$/g, ''));

    /**
     * The character used to separate paths in the system path.
     * @type {string}
     */
    this.pathSeparator = pathSeparator;
  }

  /**
   * Finds all the instances of an executable in the system path.
   * @param {string} command The command to be resolved.
   * @return {Observable<string>} A stream of the paths of the executables found.
   */
  find(command) {
    return Observable.from(this.path).mergeMap(path => this._findExecutables(path, command));
  }

  /**
   * Gets a value indicating whether the specified file is executable.
   * @param {string} file The path of the file to be checked.
   * @return {Observable<boolean>} `true` if the specified file is executable, otherwise `false`.
   */
  isExecutable(file) {
    const getStats = Observable.bindNodeCallback(stats);
    return getStats(file).map(fileInfo => {

    });
  }

  /**
   * Checks that the specified file is executable according to the executable file extensions.
   * @param {string} file The path of the file to be checked.
   * @return {Observable<boolean>} Value indicating whether the specified file is executable.
   */
  _checkFileExtension(file) {

  }

  /**
   * Checks that the specified file is executable according to its permissions.
   * @param {string} file The path of the file to be checked.
   * @return {Observable<boolean>} Value indicating whether the specified file is executable.
   */
  _checkFilePermissions(file) {

  }

  /**
   * Finds all the instances of an executable in the specified directory.
   * @param {string} directory The directory path.
   * @param {string} command The command to be resolved.
   * @return {Observable<string>} A stream of the paths of the executables found.
   */
  _findExecutables(directory, command) {
    return Observable.from([''].push(...this.extensions))
      .mergeMap(extension => {
        let resolvedPath = join(directory, command) + extension.toLowerCase();
      })
      .filter(resolvedPath => resolvedPath.length > 0);
  }
};
