import { stat } from "fs/promises";
import { delimiter, extname, resolve } from "path";
/** Finds the instances of an executable in the system path. */
export class Finder {
    /**
     * Creates a new finder.
     * @param options An object specifying values used to initialize this instance.
     */
    constructor(options = {}) {
        let { extensions = [], path = [], pathSeparator = "" } = options;
        if (!pathSeparator.length)
            pathSeparator = Finder.isWindows ? ";" : delimiter;
        if (!Array.isArray(path))
            path = path.split(pathSeparator).filter(item => item.length > 0);
        if (!path.length) {
            const pathEnv = process.env.PATH ?? "";
            if (pathEnv.length)
                path = pathEnv.split(pathSeparator);
        }
        if (!Array.isArray(extensions))
            extensions = extensions.split(pathSeparator).filter(item => item.length > 0);
        if (!extensions.length && Finder.isWindows) {
            const pathExt = process.env.PATHEXT ?? "";
            extensions = pathExt.length ? pathExt.split(pathSeparator) : [".exe", ".cmd", ".bat", ".com"];
        }
        this.pathSeparator = pathSeparator;
        this.extensions = extensions.map(extension => extension.toLowerCase());
        this.path = path.map(directory => directory.replace(/^"+|"+$/g, ""));
    }
    /** Value indicating whether the current platform is Windows. */
    static get isWindows() {
        if (process.platform == "win32")
            return true;
        return process.env.OSTYPE == "cygwin" || process.env.OSTYPE == "msys";
    }
    /**
     * Finds the instances of an executable in the system path.
     * @param command The command to be resolved.
     * @return The paths of the executables found.
     */
    async *find(command) {
        for (const directory of this.path)
            yield* this._findExecutables(directory, command);
    }
    /**
     * Gets a value indicating whether the specified file is executable.
     * @param file The path of the file to be checked.
     * @return `true` if the specified file is executable, otherwise `false`.
     */
    async isExecutable(file) {
        try {
            const fileStats = await stat(file);
            if (!fileStats.isFile())
                return false;
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
    _checkFileExtension(file) {
        return this.extensions.includes(extname(file).toLowerCase()) || this.extensions.includes(file.toLowerCase());
    }
    /**
     * Checks that the specified file is executable according to its permissions.
     * @param fileStats A reference to the file to be checked.
     * @return Value indicating whether the specified file is executable.
     */
    _checkFilePermissions(fileStats) {
        // Others.
        const perms = fileStats.mode;
        if (perms & 0o001)
            return true;
        // Group.
        const gid = typeof process.getgid == "function" ? process.getgid() : -1;
        if (perms & 0o010)
            return gid == fileStats.gid;
        // Owner.
        const uid = typeof process.getuid == "function" ? process.getuid() : -1;
        if (perms & 0o100)
            return uid == fileStats.uid;
        // Root.
        return perms & (0o100 | 0o010) ? uid == 0 : false;
    }
    /**
     * Finds the instances of an executable in the specified directory.
     * @param directory The directory path.
     * @param command The command to be resolved.
     * @return The paths of the executables found.
     */
    async *_findExecutables(directory, command) {
        for (const extension of ["", ...this.extensions]) {
            const resolvedPath = resolve(directory, `${command}${extension.toLowerCase()}`);
            if (await this.isExecutable(resolvedPath))
                yield resolvedPath;
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
    constructor(command, finder, message = "") {
        super(message);
        this.command = command;
        this.finder = finder;
        this.name = "FinderError";
    }
}
