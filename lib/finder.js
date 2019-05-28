import {promises} from 'fs';
import {delimiter, extname, join, resolve} from 'path';

/**
 * Defines the options of a {@link Finder} instance.
 * @typedef {object} FinderOptions
 * @property {string|string[]} [extensions] The list of executable file extensions.
 * @property {string|string[]} [path] The list of system paths.
 * @property {string} [pathSeparator] The character used to separate paths in the system path.
 */

/** Finds the instances of an executable in the system path. */
export class Finder {

  /**
   * Value indicating whether the current platform is Windows.
   * @type {boolean}
   */
  static get isWindows() {
    if (process.platform == 'win32') return true;
    return process.env.OSTYPE == 'cygwin' || process.env.OSTYPE == 'msys';
  }

  /**
   * Creates a new finder.
   * @param {FinderOptions} [options] An object specifying values used to initialize this instance.
   */
  constructor(options = {}) {
    let {extensions = [], path = [], pathSeparator = ''} = options; // eslint-disable-line prefer-const
    if (!pathSeparator.length) pathSeparator = Finder.isWindows ? ';' : delimiter;

    if (!Array.isArray(path)) path = path.split(pathSeparator).filter(item => item.length > 0);
    if (!path.length) {
      const pathEnv = 'PATH' in process.env ? process.env.PATH : '';
      if (pathEnv.length) path = pathEnv.split(pathSeparator);
    }

    if (!Array.isArray(extensions)) extensions = extensions.split(pathSeparator).filter(item => item.length > 0);
    if (!extensions.length && Finder.isWindows) {
      const pathExt = 'PATHEXT' in process.env ? process.env.PATHEXT : '';
      extensions = pathExt.length ? pathExt.split(pathSeparator) : ['.exe', '.cmd', '.bat', '.com'];
    }

    /**
     * The character used to separate paths in the system path.
     * @type {string}
     */
    this.pathSeparator = pathSeparator;

    /**
     * The list of executable file extensions.
     * @type {string[]}
     */
    this.extensions = extensions.map(extension => extension.toLowerCase());

    /**
     * The list of system paths.
     * @type {string[]}
     */
    this.path = path.map(directory => directory.replace(/^"+|"+$/g, ''));
  }

  /**
   * Finds the instances of an executable in the system path.
   * @param {string} command The command to be resolved.
   * @yield {Promise<string>} The path of the next executable found.
   */
  async *find(command) {
    for (const directory of this.path) yield* this._findExecutables(directory, command);
  }

  /**
   * Gets a value indicating whether the specified file is executable.
   * @param {string} file The path of the file to be checked.
   * @return {Promise<boolean>} `true` if the specified file is executable, otherwise `false`.
   */
  async isExecutable(file) {
    try {
      const fileStats = await promises.stat(file);
      if (!fileStats.isFile()) return false;
      return Finder.isWindows ? this._checkFileExtension(file) : this._checkFilePermissions(fileStats);
    }

    catch {
      return false;
    }
  }

  /**
   * Checks that the specified file is executable according to the executable file extensions.
   * @param {string} file The path of the file to be checked.
   * @return {boolean} Value indicating whether the specified file is executable.
   * @access private
   */
  _checkFileExtension(file) {
    return this.extensions.includes(extname(file).toLowerCase()) || this.extensions.includes(file.toLowerCase());
  }

  /**
   * Checks that the specified file is executable according to its permissions.
   * @param {module:fs.Stats} fileStats A reference to the file to be checked.
   * @return {boolean} Value indicating whether the specified file is executable.
   * @access private
   */
  _checkFilePermissions(fileStats) {
    // Others.
    const perms = fileStats.mode;
    if (perms & 0o001) return true;

    // Group.
    const gid = process.getgid ? process.getgid() : -1;
    if (perms & 0o010) return gid == fileStats.gid;

    // Owner.
    const uid = process.getuid ? process.getuid() : -1;
    if (perms & 0o100) return uid == fileStats.uid;

    // Root.
    return perms & (0o100 | 0o010) ? uid == 0 : false;
  }

  /**
   * Finds the instances of an executable in the specified directory.
   * @param {string} directory The directory path.
   * @param {string} command The command to be resolved.
   * @return {AsyncIterable<string>} The paths of the executables found.
   * @access private
   */
  async *_findExecutables(directory, command) {
    for (const extension of ['', ...this.extensions]) {
      const resolvedPath = resolve(join(directory, command) + extension.toLowerCase());
      if (await this.isExecutable(resolvedPath)) yield resolvedPath;
    }
  }
}

/** An exception caused by a {@link Finder} in a command lookup. */
export class FinderError extends Error {

  /**
   * Creates a new finder error.
   * @param {string} command The looked up command.
   * @param {Finder} finder The finder used to lookup the command.
   * @param {?string} [message] A message describing the error.
   */
  constructor(command, finder, message = null) {
    super(message);
    this.name = 'FinderError';

    /**
     * The looked up command.
     * @type {string}
     */
    this.command = command;

    /**
     * The finder used to lookup the command.
     * @type {Finder}
     */
    this.finder = finder;
  }
}
