'use strict';

const program = require('commander');
const {version: pkgVersion} = require('../package.json');
const {which} = require('./which');

/**
 * Represents an application providing functionalities specific to console requests.
 */
exports.Application = class Application {

  /**
   * The class name.
   * @type {string}
   */
  get [Symbol.toStringTag]() {
    return 'Application';
  }

  /**
   * Initializes the application.
   * @param {string[]} args The command line arguments.
   */
  init(args) {
    program.name('which')
      .description('Find the instances of an executable in the system path.')
      .version(pkgVersion, '-v, --version')
      .option('-a, --all', 'list all instances of executables found (instead of just the first one)')
      .option('-s, --silent', 'silence the output, just return the exit code (0 if any executable is found, otherwise 1)')
      .arguments('<command>')
      .action(command => program.executable = command)
      .parse(args);
  }

  /**
   * Runs the application.
   * @param {string[]} [args] The command line arguments.
   * @return {Promise<number>} The application exit code.
   */
  async run(args = []) {
    this.init(args.length ? args : process.argv);

    if (!program.executable) {
      program.outputHelp();
      return 64;
    }

    try {
      let executables = await which(program.executable, {all: program.all});
      if (!program.silent) {
        if (!Array.isArray(executables)) executables = [executables];
        for (let path of executables) console.log(path);
      }

      return 0;
    }

    catch (err) {
      return 1;
    }
  }
};
