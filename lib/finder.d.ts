/**
 * Finds the instances of an executable in the system path.
 */
export declare class Finder {
	#private;
	/**
	 * The list of executable file extensions.
	 */
	readonly extensions: Set<string>;
	/**
	 * The list of system paths.
	 */
	readonly paths: Set<string>;
	/**
	 * Creates a new finder.
	 * @param options An object providing values to initialize this instance.
	 */
	constructor(options?: FinderOptions);
	/**
	 * Value indicating whether the current platform is Windows.
	 */
	static get isWindows(): boolean;
	/**
	 * Finds the instances of an executable in the system path.
	 * @param command The command to be resolved.
	 * @returns The paths of the executables found.
	 */
	find(command: string): AsyncGenerator<string, void>;
	/**
	 * Gets a value indicating whether the specified file is executable.
	 * @param file The path of the file to be checked.
	 * @returns `true` if the specified file is executable, otherwise `false`.
	 */
	isExecutable(file: string): Promise<boolean>;
}
/**
 * Defines the options of a {@link Finder} instance.
 */
export type FinderOptions = Partial<{
	/**
	 * The list of executable file extensions.
	 */
	extensions: Array<string>;
	/**
	 * The list of system paths.
	 */
	paths: Array<string>;
}>;
//# sourceMappingURL=finder.d.ts.map
