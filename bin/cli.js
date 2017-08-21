#!/usr/bin/env node
'use strict';

const {Application} = require('../lib');

/**
 * Application entry point.
 * @return {Observable} Completes when the program is terminated.
 */
function main() {
  process.title = 'Which.js';
  return (new Application).run()
    .catch(() => process.exit(1))
    .do(process.exit);
}

// Start the application.
if (module === require.main) main().subscribe({error: err => {
  console.error(err);
  process.exit(2);
}});
