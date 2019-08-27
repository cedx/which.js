import {promises, Stats} from 'fs';
import {delimiter, extname, join, resolve} from 'path';

/** Finds the instances of an executable in the system path. */
export class Finder {

  /** The list of executable file extensions. */
  extensions: string[];

  /** The list of system paths. */
  path: string[];

  /** The character used to separate paths in the system path. */
  pathSeparator: string;

  /**
   * Creates a new finder.
   * @param options An object specifying values used to initialize this instance.
   */
  constructor(options: Partial<FinderOptions> = {}) {
    let {extensions = [], path = [], pathSeparator = ''} = options;
    if (!pathSeparator.length) pathSeparator = Finder.isWindows ? ';' : delimiter;

    if (!Array.isArray(path)) path = path.split(pathSeparator).filter(item => item.length > 0);
    if (!path.length) {
      const pathEnv = 'PATH' in process.env ? process.env.PATH! : '';
      if (pathEnv.length) path = pathEnv.split(pathSeparator);
    }

    if (!Array.isArray(extensions)) extensions = extensions.split(pathSeparator).filter(item => item.length > 0);
    if (!extensions.length && Finder.isWindows) {
      const pathExt = 'PATHEXT' in process.env ? process.env.PATHEXT! : '';
      extensions = pathExt.length ? pathExt.split(pathSeparator) : ['.exe', '.cmd', '.bat', '.com'];
    }

    this.pathSeparator = pathSeparator;
    this.extensions = extensions.map(extension => extension.toLowerCase());
    this.path = path.map(directory => directory.replace(/^"+|"+$/g, ''));
  }

  /** Value indicating whether the current platform is Windows. */
  static get isWindows(): boolean {
    if (process.platform == 'win32') return true;
    return process.env.OSTYPE == 'cygwin' || process.env.OSTYPE == 'msys';
  }

  /**
   * Finds the instances of an executable in the system path.
   * @param command The command to be resolved.
   * @return The paths of the executables found.
   */
  async *find(command: string): AsyncIterableIterator<string> { // eslint-disable-line @typescript-eslint/require-await
    for (const directory of this.path) yield* this._findExecutables(directory, command);
  }

  /**
   * Gets a value indicating whether the specified file is executable.
   * @param file The path of the file to be checked.
   * @return `true` if the specified file is executable, otherwise `false`.
   */
  async isExecutable(file: string): Promise<boolean> {
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
   * @return The paths of the executables found.
   */
  private async *_findExecutables(directory: string, command: string): AsyncIterableIterator<string> {
    for (const extension of ['', ...this.extensions]) {
      const resolvedPath = resolve(join(directory, command) + extension.toLowerCase());
      if (await this.isExecutable(resolvedPath)) yield resolvedPath;
    }
  }
}

/** An exception caused by a [[Finder]] in a command lookup. */
export class FinderError extends Error {

  /**
   * Creates a new finder error.
   * @param command The looked up command.
   * @param finder The finder used to lookup the command.
   * @param message A message describing the error.
   */
  constructor(readonly command: string, readonly finder: Finder, message: string = '') {
    super(message);
    this.name = 'FinderError';
  }
}

/** Defines the options of a [[Finder]] instance. */
export interface FinderOptions {

  /** The list of executable file extensions. */
  extensions: string|string[];

  /** The list of system paths. */
  path: string|string[];

  /** The character used to separate paths in the system path. */
  pathSeparator: string;
}