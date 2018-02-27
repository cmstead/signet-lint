'use strict';

const glob = require('glob');

function globber(
    signet,
    utils) {

    const { first, rest } = utils;

    function globPatterns(patterns, result, callback) {
        if (patterns.length > 0) {
            const pattern = first(patterns);
            const remaining = rest(patterns);

            glob(pattern, function (error, files) {
                if (!error) {
                    result = result.concat(files);
                    globPatterns(remaining, result, callback);
                } else {
                    callback(error);
                }
            });
        } else {
            callback(null, result);
        }
    }

    function globFiles(filePatterns, callback) {
        globPatterns(filePatterns, [], callback);
    }

    function buildGlobMap(filePatterns, callback) {
        globPatterns(filePatterns, [], function(error, filePaths){
            const globMap = filePaths.reduce(function (result, path) {
                result[path] = true;
                return result;
            }, {});

            callback(error, globMap);
        });
    }

    return {
        buildGlobMap: signet.enforce(
            'array<globPattern>, callback => undefined',
            buildGlobMap),
        globFiles: signet.enforce(
            'array<globPattern>, callback => undefined',
            globFiles)
    };
}

module.exports = globber;