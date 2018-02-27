'use strict';

function lintAndReportService(
    fileLoader,
    globber,
    globToSignetNodes,
    lintReporter,
    lintSource,
    signet) {

    function buildLintJSON(exclusionFiles, nextSource, signetTypeNodes) {
        let lintOutput = {};
        let currentFile;

        while ((currentFile = nextSource()) !== null) {
            const currentFileName = currentFile[0];

            if(exclusionFiles[currentFileName]) {
                continue;
            }

            const lintResult = lintSource
                .loadTypesAndLint(signetTypeNodes, currentFile[1]);

            if (lintResult.length > 0) {
                lintOutput[currentFileName] = lintResult;
            }
        }

        return lintOutput;
    }

    function loadAndLintFiles(lintConfig, signetTypeNodes, callback) {
        fileLoader
            .loadIterateableFileData(
                lintConfig.sourceFiles,
                function (error, nextSource) {
                    const excludeFiles = signet.isTypeOf('array')(lintConfig.excludeFiles)
                        ? lintConfig.excludeFiles
                        : [];

                    globber.buildGlobMap(
                        excludeFiles,
                        function (error, exclusionFiles) {
                            const lintOutput = buildLintJSON(exclusionFiles, nextSource, signetTypeNodes);

                            callback(null, lintOutput);
                        });
                });
    }

    function reportAsJson(lintConfig, callback) {
        globToSignetNodes
            .getSignetNodes(
                lintConfig.typeFiles,
                function (error, signetTypeNodes) {
                    loadAndLintFiles(lintConfig, signetTypeNodes, callback);
                });
    }

    function buildCLIReportValues(resultsAsJson) {
        return Object
            .keys(resultsAsJson)
            .reduce(function (result, fileKey) {
                const lintValues = resultsAsJson[fileKey];

                result.push('File: ' + fileKey);
                return result.concat(lintReporter.buildReport(lintValues));
            }, []);
    }

    function reportAsCLI(lintConfig, callback) {
        reportAsJson(lintConfig, function (error, resultsAsJson) {
            const resultAsCLI = buildCLIReportValues(resultsAsJson);

            callback(error, resultAsCLI);
        });
    }

    return {
        reportAsJson: signet.enforce(
            'lintConfig:object, callback => undefined',
            reportAsJson),
        reportAsCLI: signet.enforce(
            'lintConfig:object, callback => undefined',
            reportAsCLI)
    };
}

module.exports = lintAndReportService;