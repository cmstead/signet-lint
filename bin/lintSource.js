'use strict';

const signet = require('../signet-types');
const parser = require('./parser');
const nodeHelper = require('./nodeHelper');
const verifier = require('./verifier');

function verifyBuilder(signet) {
    return function (node) {
        return verifier.verify(node, signet);
    };
}

function push(values, newValue) {
    values.push(newValue);
    return values;
}

function captureOutputIfError(verify, results, node) {
    const result = verify(node);

    return result !== null
        ? push(results, result)
        : results;
}

const getLintResult =
    (verify) =>
        (results, node) =>
            captureOutputIfError(verify, results, node);

function getLintErrors(nodes, signet) {
    const verify = verifyBuilder(signet);
    return nodes.reduce(getLintResult(verify), []);
}

function verify(fileSource, signet) {
    const ast = parser.parseSource(fileSource);
    const signetNodes = nodeHelper.collectSignetNodes(ast);

    return getLintErrors(signetNodes, signet);
}

module.exports = {
    verify: signet.enforce(
        'source => array<lintError>',
        verify)
};