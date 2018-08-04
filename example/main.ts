import {which} from '@cedx/which';

/**
 * Finds the instances of an executable.
 */
async function main(): Promise<void> {
  /* tslint:disable: no-console */

  try {
    // `path` is the absolute path to the executable.
    const path: string = await which('foobar');
    console.log(`The command "foobar" is located at: ${path}`);
  }

  catch (err) {
    // `err` is an instance of `FinderError`.
    console.log(`The command "${err.command}" was not found`);
  }
}
