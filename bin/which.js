#!/usr/bin/env node
'use strict';

/* tslint:disable: no-console */
const program = require('commander');
const {FinderError, which} = require('../lib');

/**
 * The version number of the package.
 * @type {string}
 */
const version = '5.4.0';

/**
 * Application entry point.
 * @return {Promise} Completes when the program is terminated.
 */
async function main() {
  // Initialize the application.
  process.title = 'Which.js';

  // Parse the command line arguments.
  program.name('which')
    .description('Find the instances of an executable in the system path.')
    .version(version, '-v, --version')
    .option('-a, --all', 'list all instances of executables found (instead of just the first one)')
    .option('-s, --silent', 'silence the output, just return the exit code (0 if any executable is found, otherwise 1)')
    .arguments('<command>').action(command => program.executable = command)
    .parse(process.argv);

  if (!program.executable) {
    program.outputHelp();
    process.exitCode = 64;
    return;
  }

  // Run the program.
  let executables = await which(program.executable, {all: program.all});
  if (!program.silent) {
    if (!Array.isArray(executables)) executables = [executables];
    for (const path of executables) console.log(path);
  }
}

// Start the application.
main().catch(err => {
  if (err instanceof FinderError) process.exitCode = 1;
  else {
    console.error(err);
    process.exitCode = 2;
  }
});
