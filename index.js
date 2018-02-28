#!/usr/bin/env node

'use strict';

const actionSwitch = process.argv[2].toLowerCase();
const actionArg = process.argv[3];
const container = require('./container');

if (actionSwitch === 'init') {
    container.build('cliInit').initialize();
} else if (actionSwitch === 'file') {
    container.build('cliLint').lintAndReport(actionArg);
} else if (actionSwitch === '-h' || actionSwitch === 'help') {
    console.log(`
Signet-lint is a linter for signet in your project.

Command:

signet-lint [init][-h][help]

Options:

init        Creates default .signetlintrc file in current directory
-h, help    Prints help information
`);

} else {
    container.build('cliLint').lintAndReport();
}
