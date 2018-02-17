'use strict';

const signet = require('../signet-types');
const glob = require('glob');
const { first, rest } = require('./utils');

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

module.exports = {
    globFiles: signet.enforce(
        'array<globPattern>, callback => undefined', 
        globFiles)
}
