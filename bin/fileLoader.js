'use strict';

const signet = require('../signet-types');
const globber = require('./globber');
const fs = require('fs');

function fileNameToSource(fileName){
    const source = fs.readFileSync(fileName, { encoding: 'utf8' });
    return [fileName, source];
}

function loadFileSource(globPatterns, callback) {
    globber.globFiles(globPatterns, function (error, files) {
        const sourceData = files.map(fileNameToSource, []);
        callback(null, sourceData);
    });
}

module.exports = {
    loadFileSource: signet.enforce(
        'array<globPattern>, callback => undefined',
        loadFileSource)
}