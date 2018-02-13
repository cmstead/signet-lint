'use strict';

const signet = require('../signet-types');
const { checkPropertyName } = require('./utils');
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

const isEnforcement = checkPropertyName('enforce');
const isSigning = checkPropertyName('sign');
const isTypeCheck = checkPropertyName('isTypeOf');
const isVerifyValueType = checkPropertyName('verifyValueType');
const isSubtypeDeclaration = checkPropertyName('subtype');
const isAliasDeclaration = checkPropertyName('alias');
const isDuckType = checkPropertyName('defineDuckType');

const isDefault = () => true;
const defaultCheck = () => null;

const verificationMethods = [
    [isAliasDeclaration, verifyAliasDeclaration],
    [isDuckType, verifyDuckType],
    [isEnforcement, verifyEnforce],
    [isSigning, verifyEnforce],
    [isSubtypeDeclaration, verifyTypeCheck],
    [isTypeCheck, verifyTypeCheck],
    [isVerifyValueType, verifyTypeCheck],

    [isDefault, defaultCheck]
];



function getVerficationMethod(node) {
    let verifier;

    for(let i = 0; i < verificationMethods.length; i++) {
        let verificationCheck = verificationMethods[i][0];

        if(verificationCheck(node)) {
            verifier = verificationMethods[i][1];
            break;
        }
    }

    return verifier;
}

function verify(node, signet) {
    return getVerficationMethod(node)(node, signet);
}

module.exports = {
    verify: signet.enforce(
        'astNode, signet => variant<LintErrorOrNull, array<LintErrorOrNull>>',
        verify)
}

