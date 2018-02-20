'use strict';

const signet = require('../signet-types');
const fileLoader = require('./fileLoader');
const nodeHelper = require('./nodeHelper');
const parser = require('./parser');

function extractSignetNodes([ fileName, fileSource ]) {
    const ast = parser.parseSource(fileSource);
    const signetNodes = [];

    nodeHelper.callOnSignetNodes(ast, (node, type) => signetNodes.push({
        type: type,
        node: node
    }));

    return [
        fileName,
        signetNodes
    ];
}

function getSignetNodes(globPatterns, callback) {
    fileLoader.loadFileSource(globPatterns, function (error, data) {
        const signetNodes = data.map(extractSignetNodes);
        callback(null, signetNodes);
    });
}

module.exports = {
    getSignetNodes: signet.enforce(
        'array<globPattern>, callback => undefined',
        getSignetNodes)
}
