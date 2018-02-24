'use strict';

function globToSignetNodes(
    fileLoader,
    nodeHelper,
    parser,
    signet) {

    function extractSignetNodes([fileName, fileSource]) {
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

    return {
        getSignetNodes: signet.enforce(
            'array<globPattern>, callback => undefined',
            getSignetNodes)
    }
}

module.exports = globToSignetNodes;