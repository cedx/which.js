#!/usr/bin/env node
'use strict';

const program = require('commander');
const {which} = require('../lib');
const {version: pkgVersion} = require('../package.json');

/**
 * Application entry point.
 * @return {Promise<number>} The application exit code.
 */
async function main() {
  process.title = 'Which.js';

  program.name('which')
    .description('Find the instances of an executable in the system path.')
    .version(pkgVersion, '-v, --version')
    .option('-a, --all', 'list all instances of executables found (instead of just the first one)')
    .option('-s, --silent', 'silence the output, just return the exit code (0 if any executable is found, otherwise 1)')
    .arguments('<command>')
    .action(command => program.executable = command)
    .parse(process.argv);

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

// Start the application.
if (module === require.main) main().then(
  code => process.exit(code),
  err => {
    console.error(err);
    process.exit(2);
  }
);
