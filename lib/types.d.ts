/** Finds the instances of an executable in the system path. */
export declare class Finder {

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
  constructor(options?: Partial<FinderOptions>);

  /** Value indicating whether the current platform is Windows. */
  static readonly isWindows: boolean;

  /**
   * Finds the instances of an executable in the system path.
   * @param command The command to be resolved.
   * @return The paths of the executables found.
   */
  find(command: string): AsyncIterable<string>;

  /**
   * Gets a value indicating whether the specified file is executable.
   * @param file The path of the file to be checked.
   * @return `true` if the specified file is executable, otherwise `false`.
   */
  isExecutable(file: string): Promise<boolean>;
}

/** An exception caused by a `Finder` in a command lookup. */
export declare class FinderError extends Error {

  /** The looked up command. */
  command: string;

  /** The finder used to lookup the command. */
  finder: Finder;

  /**
   * Creates a new finder error.
   * @param command The looked up command.
   * @param finder The finder used to lookup the command.
   * @param message A message describing the error.
   */
  constructor(command: string, finder: Finder, message?: string);
}

/** Defines the options of a `Finder` instance. */
export interface FinderOptions {

  /** The list of executable file extensions. */
  extensions: string | string[];

  /** The list of system paths. */
  path: string | string[];

  /** The character used to separate paths in the system path. */
  pathSeparator: string;
}

/**
 * Finds the first instance of an executable in the system path.
 * Rejects with a `FinderError` if the command was not found.
 * @param command The command to be resolved.
 * @param options The options to be passed to the finder.
 * @return A string, or an array of strings, specifying the path(s) of the found executable(s).
 */
export declare function which(command: string, options?: Partial<WhichOptions>): Promise<string | string[]>;

/** Defines the options of the `which()` function. */
export interface WhichOptions extends FinderOptions {

  /** Value indicating whether to return an array of all executables found, instead of just the first one. */
  all: boolean;

  /** An optional error handler. It is called with the command as argument, and its return value is used instead. */
  onError: (command: string) => any;
}
