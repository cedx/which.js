import {promises, Stats} from 'fs';
import {delimiter, extname, join, resolve} from 'path';

/**
 * Finds the instances of an executable in the system path.
 */
export class Finder {

  /**
   * The list of executable file extensions.
   */
  public extensions: string[];

  /**
   * The list of system paths.
   */
  public path: string[];

  /**
   * The character used to separate paths in the system path.
   */
  public pathSeparator: string;

  /**
   * Value indicating whether the current platform is Windows.
   */
  static get isWindows(): boolean {
    if (process.platform == 'win32') return true;
    return process.env.OSTYPE == 'cygwin' || process.env.OSTYPE == 'msys';
  }

  /**
   * Creates a new finder.
   * @param [options] An object specifying values used to initialize this instance.
   */
  constructor(options: FinderOptions = {}) {
    // tslint:disable-next-line: prefer-const
    let {extensions = '', path = '', pathSeparator = ''} = options;
    this.pathSeparator = pathSeparator.length ? pathSeparator : (Finder.isWindows ? ';' : delimiter);

    if (!Array.isArray(path)) path = path.split(pathSeparator).filter(item => item.length > 0);
    if (!path.length) {
      const pathEnv = process.env.PATH;
      if (pathEnv) path = pathEnv.split(pathSeparator);
    }

    if (!Array.isArray(extensions)) extensions = extensions.split(pathSeparator).filter(item => item.length > 0);
    if (!extensions.length && Finder.isWindows) {
      const pathExt = process.env.PATHEXT;
      extensions = pathExt ? pathExt.split(pathSeparator) : ['.exe', '.cmd', '.bat', '.com'];
    }

    this.extensions = extensions.map(extension => extension.toLowerCase());
    console.log(this.extensions);
    this.path = path.map(directory => directory.replace(/^"+|"+$/g, ''));
    console.log(this.path);
  }

  /**
   * The class name.
   */
  get [Symbol.toStringTag](): string {
    return 'Finder';
  }

  /**
   * Finds the instances of an executable in the system path.
   * @param command The command to be resolved.
   * @param [all] Value indicating whether to return all executables found, or just the first one.
   * @return The paths of the executables found, or an empty array if the command was not found.
   */
  public async find(command: string, all: boolean = true): Promise<string[]> {
    const executables = [];
    for (const path of this.path) {
      executables.push(...await this._findExecutables(path, command, all));
      if (!all && executables.length) return executables;
    }

    return [...new Set(executables)];
  }

  /**
   * Gets a value indicating whether the specified file is executable.
   * @param file The path of the file to be checked.
   * @return `true` if the specified file is executable, otherwise `false`.
   */
  public async isExecutable(file: string): Promise<boolean> {
    try {
      const fileStats = await promises.stat(file);
      if (!fileStats.isFile()) return false;
      return Finder.isWindows ? this._checkFileExtension(file) : this._checkFilePermissions(fileStats);
    }

    catch (err) {
      return false;
    }
  }

  /**
   * Returns a string representation of this object.
   * @return The string representation of this object.
   */
  public toString(): string {
    const values = [];
    if (this.path.length) values.push(`path: "${this.path.join(this.pathSeparator)}"`);
    if (this.extensions.length) values.push(`extensions: "${this.extensions.join(this.pathSeparator)}"`);
    return `${this[Symbol.toStringTag]}(${values.join(', ')})`;
  }

  /**
   * Checks that the specified file is executable according to the executable file extensions.
   * @param file The path of the file to be checked.
   * @return Value indicating whether the specified file is executable.
   */
  private _checkFileExtension(file: string): boolean {
    return this.extensions.includes(extname(file).toLowerCase()) || this.extensions.includes(file.toLowerCase());
  }

  /**
   * Checks that the specified file is executable according to its permissions.
   * @param fileStats A reference to the file to be checked.
   * @return Value indicating whether the specified file is executable.
   */
  private _checkFilePermissions(fileStats: Stats): boolean {
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
   * @param directory The directory path.
   * @param command The command to be resolved.
   * @param [all] Value indicating whether to return all executables found, or just the first one.
   * @return The paths of the executables found, or an empty array if the command was not found.
   */
  private async _findExecutables(directory: string, command: string, all: boolean = true): Promise<string[]> {
    const executables = [];
    for (const extension of [''].concat(this.extensions)) {
      const resolvedPath = resolve(join(directory, command) + extension.toLowerCase());
      if (await this.isExecutable(resolvedPath)) {
        executables.push(resolvedPath);
        if (!all) return executables;
      }
    }

    return executables;
  }
}

/**
 * An exception caused by a `Finder` in a command lookup.
 */
export class FinderError extends Error {

  /**
   * Creates a new finder error.
   * @param command The looked up command.
   * @param finder The finder used to lookup the command.
   * @param [message] A message describing the error.
   */
  constructor(public command: string, public finder: Finder, message: string = '') {
    super(message);
    this.name = 'FinderError';
  }

  /**
   * Returns a string representation of this object.
   * @return The string representation of this object.
   */
  public toString(): string {
    const values = [`"${this.command}"`];
    if (this.finder.path.length) values.push(`finder: "${this.finder.path.join(this.finder.pathSeparator)}"`);
    if (this.message.length) values.push(`message: "${this.message}"`);
    return `FinderError(${values.join(', ')})`;
  }
}

/**
 * Defines the options of a `Finder` instance.
 */
export interface FinderOptions {

  /**
   * The list of executable file extensions.
   */
  extensions?: string | string[];

  /**
   * The list of system paths.
   */
  path?: string | string[];

  /**
   * The character used to separate paths in the system path.
   */
  pathSeparator?: string;
}
