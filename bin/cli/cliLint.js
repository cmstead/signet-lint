'use strict';

function cliLint(chalk, fs, lintAndReportService) {

    const cwd = process.cwd();

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

    function getExitCode(results) {
        let exitCode = 0;

        for(let i = 0; i < results.length; i++) {
            const fileResults = results[i][1];

            for(let j = 0; j < fileResults.length; j++) {
                if(fileResults[j].errorLevel === 'error') {
                    exitCode = 1;
                    break;
                }
            }

            if(exitCode === 1) {
                break;
            }
        }

        return exitCode;
    }

    function logJsonResultAndExit(results) {
        const exitCode = getExitCode(results);

        console.log(JSON.stringify(results));

        process.exit(exitCode);
    }

    function logErrorAndExit(error) {
        const errorMessage = 'Signet-lint encountered an error: \n' + error.message;

        padAndLog(errorMessage);

        process.exit(999);
    }

    function updateLintConfig(lintConfig, filename) {
        if (typeof filename === 'string') {
            lintConfig.sourceFiles = [filename];
        }
    }

    function getLintConfig () {
        const lintConfigSource = fs.readFileSync(cwd + '/.signetlintrc');
        return JSON.parse(lintConfigSource);
    }

    function lintAndReportAsJson(filename) {
        const lintConfig = getLintConfig();

        updateLintConfig(lintConfig, filename);

        lintAndReportService
            .reportAsJson(lintConfig, function (error, results) {
                if (error) {
                    logErrorAndExit(error);
                } else {
                    logJsonResultAndExit(results);
                }
            });
    }

    function lintAndReport(filename) {
        const lintConfig = getLintConfig();

        updateLintConfig(lintConfig, filename);

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
        lintAndReport: lintAndReport,
        lintAndReportAsJson: lintAndReportAsJson
    };

}

module.exports = cliLint;
