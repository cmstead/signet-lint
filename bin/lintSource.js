'use strict';

const signet = require('../signet-types');
const parser = require('./parser');
const nodeHelper = require('./nodeHelper');
const verifier = require('./verifier');
const typeLoader = require('./typeLoader');

function verifyBuilder(signet) {
    return function (node) {
        return verifier.verify(node, signet);
    };
}

function loadBuilder(signet) {
    return function (node) {
        return typeLoader.loadTypeNode(node, signet);
    }
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

function getLintResult(signet) {
    const verify = verifyBuilder(signet);
    const load = loadBuilder(signet);

    return function (results, node) {
        captureOutputIfError(load, results, node);
        captureOutputIfError(verify, results, node);

        return results;
    }
}

function verify(fileSource, signet) {
    const errors = [];
    const ast = parser.parseSource(fileSource);
    const lintAndCaptureErrors = getLintResult(signet);
    const lintAction = (signetNode) => lintAndCaptureErrors(errors, signetNode);

    nodeHelper.lintSignetNodes(ast, lintAction);

    return errors;
}

module.exports = {
    verify: signet.enforce(
        'source => array<lintError>',
        verify)
};