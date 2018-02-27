#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const fs = require('fs');
const container = require('./container');
const lintAndReportService = container.build('lintAndReportService');

const cwd = process.cwd();

const lintConfigSource = fs.readFileSync(cwd + '/.signetlintrc');
const lintConfig = JSON.parse(lintConfigSource);

function outputLintResults(lintResults) {
    let exitCode = 0;

    lintResults.forEach(function (line) {
        exitCode = exitCode === 1 || line.toLowerCase().includes('error:') ? 1 : 0;
        console.log(line);
    });

    process.exit(exitCode);
}

lintAndReportService
    .reportAsCLI(lintConfig, function (error, results) {
        if(results.length > 0) {
            outputLintResults(results);
        } else {
            console.log(chalk.green('Lint is green, files are clean!'));
            process.exit(0);
        }
    })

