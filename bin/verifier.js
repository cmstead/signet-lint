'use strict';

const signet = require('../signet-types');
const { checkPropertyName } = require('./utils');
const {
    testSignature,
    testType,
    verifyOrWarn
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

const isEnforcement = checkPropertyName('enforce');
const isSigning = checkPropertyName('sign');
const isTypeCheck = checkPropertyName('isTypeOf');
const isVerifyValueType = checkPropertyName('verifyValueType');
const isSubtypeDeclaration = checkPropertyName('subtype');
const isAliasDeclaration = checkPropertyName('alias');

const isDefault = () => true;
const defaultCheck = () => null;

const verificationMethods = [
    [isEnforcement, verifyEnforce],
    [isSigning, verifyEnforce],
    [isTypeCheck, verifyTypeCheck],
    [isVerifyValueType, verifyTypeCheck],
    [isAliasDeclaration, verifyAliasDeclaration],
    [isSubtypeDeclaration, verifyTypeCheck],
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
        'astNode, signet => variant<lintError, null>',
        verify)
}

