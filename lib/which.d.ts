import { FinderOptions } from "./finder.js";
/**
 * Finds the first instance of an executable in the system path.
 * Rejects with a [[FinderError]] if the command was not found.
 * @param command The command to be resolved.
 * @param options The options to be passed to the finder.
 * @return A string, or an array of strings, specifying the path(s) of the found executable(s).
 */
export declare function which(command: string, options?: Partial<WhichOptions>): Promise<string | string[]>;
/** Defines the options of the [[which]] function. */
export interface WhichOptions extends FinderOptions {
    /** Value indicating whether to return an array of all executables found, instead of just the first one. */
    all: boolean;
    /** An optional error handler. */
    onError: (command: string) => string | string[];
}
