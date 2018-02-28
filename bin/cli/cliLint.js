'use strict';

function cliLint(chalk, fs, lintAndReportService) {

    const cwd = process.cwd();

    const lintConfigSource = fs.readFileSync(cwd + '/.signetlintrc');
    const lintConfig = JSON.parse(lintConfigSource);

    function compileLintData(lintResults) {
        let lintData = {
            errorsFound: false,
            lintOutput: ''
        };

        lintResults.forEach(function (line) {
            lintData.errorsFound =
                lintData.errorsFound
                || line.toLowerCase().includes('error:');

            lintData.lintOutput += '\n' + line;
        });

        return lintData;
    }

    function padAndLog(message) {
        console.log('\n' + message + '\n');
    }

    function logLintResults(results) {
        const lintData = compileLintData(results);
        const exitCode = lintData.errorsFound ? 1 : 0;

        const outputMessage =
            'Signet lint issues found:\n'
            + lintData.lintOutput;

        padAndLog(outputMessage);

        return exitCode;
    }

    function logSuccess() {
        padAndLog(chalk.green('Lint is green, files are clean!'));

        return 0;
    }

    function logResultAndExit(results) {
        let exitCode = results.length > 0
            ? logLintResults(results, exitCode)
            : logSuccess();

        process.exit(exitCode);
    }

    function logErrorAndExit(error) {
        const errorMessage = 'Signet-lint encountered an error: \n' + error.message;

        padAndLog(errorMessage);

        process.exit(999);
    }

    function lintAndReport(filename) {

        if(typeof filename === 'string') {
            lintConfig.sourceFiles = [filename];
        }

        lintAndReportService
            .reportAsCLI(lintConfig, function (error, results) {
                if (error) {
                    logErrorAndExit(error);
                } else {
                    logResultAndExit(results);
                }
            });

    }

    return {
        lintAndReport: lintAndReport
    };

}

module.exports = cliLint;