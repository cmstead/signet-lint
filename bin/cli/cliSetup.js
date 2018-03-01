'use strict';

function cliSetup(
    cliHelp,
    cliInit,
    cliLint,
    commandLineArgs) {

    const cliOptions = [
        { name: 'command', defaultOption: true },
        { name: 'file', type: String },
        { name: 'json', type: Boolean }
    ];

    const options = commandLineArgs(cliOptions, { stopAtFirstUnknown: true });

    if (options.command === 'init') {
        cliInit.initialize();
    } else if (options.command === 'help') {
        cliHelp.printHelp();
    } else if (options.json) {
        cliLint.lintAndReportAsJson(options.file);
    } else {
        cliLint.lintAndReport(options.file);
    }
}

module.exports = cliSetup;