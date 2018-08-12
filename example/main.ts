/* tslint:disable: no-console */

// @ts-ignore
import {which} from '@cedx/which';

/**
 * Finds the instances of an executable.
 */
async function main(): Promise<void> {
  try {
    // `path` is the absolute path to the executable.
    const path = await which('foobar') as string;
    console.log(`The command "foobar" is located at: ${path}`);
  }

  catch (err) {
    // `err` is an instance of `FinderError`.
    console.log(`The command "${err.command}" was not found`);
  }
}
