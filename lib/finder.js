'use strict';

const {stat} = require('fs');
const {delimiter, extname, join, resolve} = require('path');
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
   * Value indicating whether the current platform is Windows.
   * @type {boolean}
   */
  static get isWindows() {
    return IS_WINDOWS;
  }

  /**
   * Initializes a new instance of the class.
   * @param {string|string[]} [path] The system path. Defaults to the `PATH` environment variable.
   * @param {string|string[]} [extensions] The executable file extensions. Defaults to the `PATHEXT` environment variable.
   * @param {string} [pathSeparator] The character used to separate paths in the system path. Defaults to the `path.delimiter` constant.
   */
  constructor(path = '', extensions = '', pathSeparator = '') {
    if (!pathSeparator.length) pathSeparator = Finder.isWindows ? ';' : delimiter;

    if (!Array.isArray(path)) path = path.length ? path.split(pathSeparator) : [];
    if (!path.length) {
      let pathEnv = process.env.PATH;
      if (typeof pathEnv == 'string' && pathEnv.length) path = pathEnv.split(pathSeparator);
    }

    if (!Array.isArray(extensions)) extensions = extensions.length ? extensions.split(pathSeparator) : [];
    if (!extensions.length && Finder.isWindows) {
      let pathExt = process.env.PATHEXT;
      extensions = typeof pathExt == 'string' && pathExt.length ? pathExt.split(pathSeparator) : ['.EXE', '.CMD', '.BAT', '.COM'];
    }

    /**
     * The list of executable file extensions.
     * @type {string[]}
     */
    this.extensions = extensions;

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
    const getStats = Observable.bindNodeCallback(stat);
    return getStats(file)
      .catch(() => Observable.of(null))
      .map(fileStats => {
        if (!fileStats || !fileStats.isFile()) return false;
        return Finder.isWindows ? this._checkFileExtension(file) : this._checkFilePermissions(fileStats);
      });
  }

  /**
   * Checks that the specified file is executable according to the executable file extensions.
   * @param {string} file The path of the file to be checked.
   * @return {boolean} Value indicating whether the specified file is executable.
   */
  _checkFileExtension(file) {
    return this.extensions.includes(extname(file).toUpperCase()) || this.extensions.includes(file.toUpperCase());
  }

  /**
   * Checks that the specified file is executable according to its permissions.
   * @param {fs.Stats} fileStats A reference to the file to be checked.
   * @return {boolean} Value indicating whether the specified file is executable.
   */
  _checkFilePermissions(fileStats) {
    // Others.
    let perms = fileStats.mode;
    if (perms & 0o001) return true;

    // Group.
    let gid = typeof process.getgid == 'function' ? process.getgid() : -1;
    if (perms & 0o010) return gid == fileStats.gid;

    // Owner.
    let uid = typeof process.getuid == 'function' ? process.getuid() : -1;
    if (perms & 0o100) return uid == fileStats.uid;

    // Root.
    return perms & (0o100 | 0o010) ? uid == 0 : false;
  }

  /**
   * Finds all the instances of an executable in the specified directory.
   * @param {string} directory The directory path.
   * @param {string} command The command to be resolved.
   * @return {Observable<string>} A stream of the paths of the executables found.
   */
  _findExecutables(directory, command) {
    let extensions = [''];
    extensions.push(...this.extensions);

    return Observable.from(extensions)
      .mergeMap(extension => {
        let resolvedPath = join(directory, command) + extension.toLowerCase();
        return this.isExecutable(resolvedPath).map(isExecutable => isExecutable ? resolve(resolvedPath) : '');
      })
      .filter(resolvedPath =>
        resolvedPath.length > 0
      );
  }
};
