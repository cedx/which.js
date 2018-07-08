const {which} = require('@cedx/which');

/**
 * Finds the instances of an executable.
 */
async function main() {
  try {
    // `path` is the absolute path to the executable.
    let path = await which('foobar');
    console.log(`The command "foobar" is located at: ${path}`);
  }

  catch (err) {
    // `err` is an instance of `FinderError`.
    console.log(`The command "${err.command}" was not found`);
  }
}
