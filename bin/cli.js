#!/usr/bin/env node
'use strict';

const {Application} = require('../lib');

/**
 * Application entry point.
 */
async function main() {
  process.title = 'Which.js';
  process.exit(await (new Application).run());
}

// Start the application.
if (module === require.main) main().catch(err => {
  console.error(err);
  process.exit(2);
});
