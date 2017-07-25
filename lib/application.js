'use strict';

const program = require('commander');
const {Observable} = require('rxjs');
const {version: pkgVersion} = require('../package.json');

/**
 * Represents an application providing functionalities specific to console requests.
 */
exports.Application = class Application {

  /**
   * Initializes the application.
   */
  init() {
    program.name('which')
      .description('Find the instances of an executable in the system path.')
      .version(pkgVersion, '-v, --version')
      .option('-a, --all', 'list all instances of executables found (instead of just the first one)')
      .option('-s, --silent', 'silence the output, just return the exit code (0 if any executable is found, otherwise 1)')
      .arguments('<command>')
      .action(command => program.executable = command)
      .parse(process.argv);
  }

  /**
   * Runs the application.
   * @return {Observable<number>} The application exit code.
   */
  run() {
    // Parse the command line arguments.
    this.init();
    if (!program.executable) {
      program.outputHelp();
      return Observable.of(2);
    }

    // Run the program.
    return which(program.executable, program.all).map(function($results) {
      if (!program.silent) {
        if (!is_array($results)) $results = [$results];
        foreach ($results as $path) echo $path, PHP_EOL;
      }

      return 0;
    });
  }
};
