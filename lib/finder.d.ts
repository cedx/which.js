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
    static get isWindows(): boolean;
    /**
     * Finds the instances of an executable in the system path.
     * @param command The command to be resolved.
     * @return The paths of the executables found.
     */
    find(command: string): AsyncIterableIterator<string>;
    /**
     * Gets a value indicating whether the specified file is executable.
     * @param file The path of the file to be checked.
     * @return `true` if the specified file is executable, otherwise `false`.
     */
    isExecutable(file: string): Promise<boolean>;
    /**
     * Checks that the specified file is executable according to the executable file extensions.
     * @param file The path of the file to be checked.
     * @return Value indicating whether the specified file is executable.
     */
    private _checkFileExtension;
    /**
     * Checks that the specified file is executable according to its permissions.
     * @param fileStats A reference to the file to be checked.
     * @return Value indicating whether the specified file is executable.
     */
    private _checkFilePermissions;
    /**
     * Finds the instances of an executable in the specified directory.
     * @param directory The directory path.
     * @param command The command to be resolved.
     * @return The paths of the executables found.
     */
    private _findExecutables;
}
/** An exception caused by a [[Finder]] in a command lookup. */
export declare class FinderError extends Error {
    readonly command: string;
    readonly finder: Finder;
    /**
     * Creates a new finder error.
     * @param command The looked up command.
     * @param finder The finder used to lookup the command.
     * @param message A message describing the error.
     */
    constructor(command: string, finder: Finder, message?: string);
}
/** Defines the options of a [[Finder]] instance. */
export interface FinderOptions {
    /** The list of executable file extensions. */
    extensions: string | string[];
    /** The list of system paths. */
    path: string | string[];
    /** The character used to separate paths in the system path. */
    pathSeparator: string;
}
