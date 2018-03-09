'use strict';

function lintAndReportService(
    fileLoader,
    typeLoader,
    globber,
    globToSignetNodes,
    lintReporter,
    lintSource,
    signet,
    signetBuilder) {

    function lintNextFile(exclusionFiles, nextSource, localSignet, lintOutput, callback) {
        nextSource(function (error, fileData) {
            if (error) {
                throw new Error(error.message);
            } else if (fileData !== null) {
                const currentFileName = fileData[0];
                const currentSource = fileData[1];

                if (exclusionFiles[currentFileName]) {
                    lintNextFile(exclusionFiles,
                        nextSource,
                        localSignet,
                        lintOutput,
                        callback);
                }

                const lintResult = lintSource.verify(currentSource, localSignet)

                if (lintResult.length > 0) {
                    lintOutput[currentFileName] = lintResult;
                }

                lintNextFile(
                    exclusionFiles,
                    nextSource,
                    localSignet,
                    lintOutput,
                    callback);
            } else {
                callback(null, lintOutput);
            }
        });
    }

    function buildLintJSON(exclusionFiles, nextSource, signetTypeNodes, callback) {
        let lintOutput = {};

        const localSignet = signetBuilder();
        typeLoader.loadTypeNodes(signetTypeNodes, localSignet);
        
        lintNextFile(
            exclusionFiles,
            nextSource,
            localSignet,
            lintOutput,
            callback);
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
                            buildLintJSON(
                                exclusionFiles, 
                                nextSource, 
                                signetTypeNodes, 
                                callback);
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

                if (result.length > 0) {
                    result.push('');
                }

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