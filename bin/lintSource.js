'use strict';

const signet = require('../signet-types');
const parser = require('./parser');
const nodeHelper = require('./nodeHelper');
const verifier = require('./verifier');
const typeLoader = require('./typeLoader');

function verifyBuilder(signet) {
    return function (node, nodeType) {
        return verifier.verify(node, signet, nodeType);
    };
}

function loadBuilder(signet) {
    return function (node, nodeType) {
        return typeLoader.loadTypeNode(node, signet, nodeType);
    }
}

function getLintResult(signet) {
    const verify = verifyBuilder(signet);
    const load = loadBuilder(signet);

    return function (results, node, nodeType) {
        return results
            .concat(load(node, nodeType))
            .concat(verify(node, nodeType));
    }
}

function verify(fileSource, signet) {
    let errors = [];
    const ast = parser.parseSource(fileSource);
    const lintAndCaptureErrors = getLintResult(signet);
    const lintAction = (signetNode, nodeType) => 
        errors = lintAndCaptureErrors(errors, signetNode, nodeType);

    nodeHelper.callOnSignetNodes(ast, lintAction);

    return errors.filter((value) => value !== null);
}

module.exports = {
    verify: signet.enforce(
        'source => array<lintError>',
        verify)
};