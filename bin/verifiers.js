'use strict';

const signet = require('../signet-types');

function buildError(message, location, errorLevel = 'error') {
    return {
        error: message,
        errorLevel: errorLevel,
        loc: location
    };
}

function testSignature(signatureNode, signet) {
    const testFn = () => { };
    try {
        signet.enforce(signatureNode.value, testFn);
        return null;
    } catch (e) {
        return buildError(e.message, signatureNode.loc);
    }
}

function testType(typeNode, signet) {
    const typeValue = typeNode.value;

    try{
        signet.isTypeOf(typeValue)('');
        return null
    } catch (e) {
        const message = `Type name ${typeValue} is not a known, or registered type.`;
        return buildError(message, typeNode.loc);
    }
}

function verifyOrWarn(typeValueNode, verifier) {
    const typeValueIsString = typeValueNode.type === 'Literal';

    if (typeValueIsString) {
        return verifier();
    } else {
        const message = 'Unable to verify non-string type information';
        return buildError(message, typeValueNode.loc, 'warn');
    }
}

module.exports = {
    testSignature: signet.enforce(
        'astNode, signet => variant<lintError, null>',
        testSignature),
    testType: signet.enforce(
        'astNode, signet => variant<lintError, null>',
        testType),
    verifyOrWarn: signet.enforce(
        'astNode, verifier => variant<lintError, null>',
        verifyOrWarn)
}

