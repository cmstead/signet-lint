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

function getLintResult(signet) {
    const verify = verifyBuilder(signet);
    const load = loadBuilder(signet);

    return function (results, node) {
        return results
            .concat(load(node))
            .concat(verify(node));
    }
}

function verify(fileSource, signet) {
    let errors = [];
    const ast = parser.parseSource(fileSource);
    const lintAndCaptureErrors = getLintResult(signet);
    const lintAction = (signetNode) => errors = lintAndCaptureErrors(errors, signetNode);

    nodeHelper.lintSignetNodes(ast, lintAction);

    return errors.filter((value) => value !== null);
}

module.exports = {
    verify: signet.enforce(
        'source => array<lintError>',
        verify)
};