'use strict';

const program = require('commander');
const {Observable} = require('rxjs');
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
   * @return {Observable<number>} The application exit code.
   */
  run(args = []) {
    this.init(args.length ? args : process.argv);

    if (!program.executable) {
      program.outputHelp();
      return Observable.of(64);
    }

    return which(program.executable, program.all).map(results => {
      if (!program.silent) {
        if (!Array.isArray(results)) results = [results];
        for (let path of results) console.log(path);
      }

      return 0;
    });
  }
};
