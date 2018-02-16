'use strict';

const signet = require('../signet-types');

const {
    testSignature,
    testType,
    testDuckType,
    verifyOrWarn,
    verifyObjectOrWarn
} = require('./verifiers');

function verifyEnforce(node, signet) {
    const typeValue = node.arguments[0];
    const verifier = () => testSignature(typeValue, signet);

    return verifyOrWarn(typeValue, verifier);
}

function verifyTypeCheck(node, signet) {
    const typeValue = node.arguments[0];
    const verifier = () => testType(typeValue, signet);

    return verifyOrWarn(typeValue, verifier);
}

function verifyAliasDeclaration(node, signet) {
    const typeValue = node.arguments[1];
    const verifier = () => testType(typeValue, signet);

    return verifyOrWarn(typeValue, verifier);
}

function verifyDuckType(node, signet) {
    const typeValue = node.arguments[1];
    const verifier = () => testDuckType(typeValue, signet);

    return verifyObjectOrWarn(typeValue, verifier);
}

const verifySubtypeDeclaration = (node, signet) =>
    verifyTypeCheck(node.callee, signet);

const defaultCheck = () => null;

const verifierMethodMap = {
    alias: verifyAliasDeclaration,
    defineDuckType: verifyDuckType,
    enforce: verifyEnforce,
    sign: verifyEnforce,
    subtype: verifySubtypeDeclaration,
    isTypeOf: verifyTypeCheck,
    verifyValueType: verifyTypeCheck
};

function getVerficationMethod(node, nodeType) {
    const loader = verifierMethodMap[nodeType];

    return typeof loader === 'undefined' ? defaultCheck : loader;
}

function verify(node, signet, nodeType) {
    return getVerficationMethod(node, nodeType)(node, signet);
}

module.exports = {
    verify: signet.enforce(
        'astNode, signet => variant<LintErrorOrNull, array<LintErrorOrNull>>',
        verify)
}

