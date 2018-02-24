'use strict';

function lintReporter(chalk, signet) {

    const warnPrefix = chalk.yellow('Warning:');
    const errorPrefix = chalk.red('Error:');

    function formatErrors(error) {
        const location = `${error.loc.start.line}:${error.loc.start.column + 1}`;
        const message = error.error;
        const prefix = error.errorLevel === 'error' ? errorPrefix : warnPrefix;

        return `${prefix} ${message} starting at position [${location}]`;
    }

    function buildReport(lintErrors) {
        return lintErrors.map(formatErrors);
    }

    return {
        buildReport: signet.enforce(
            'array<lintError> => array<string>',
            buildReport)
    }

}

module.exports = lintReporter;