'use strict';

function verifiers(
    signet,
    utils) {

    const { buildError } = utils;

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

        try {
            signet.isTypeOf(typeValue)('');
            return null
        } catch (e) {
            const message = `Type name ${typeValue} is not a known, or registered type.`;
            return buildError(message, typeNode.loc);
        }
    }

    function testDuckType(typeNode, signet) {
        const properties = typeNode.properties
        let results = [];

        for (let i = 0; i < properties.length; i++) {
            const typeValueNode = properties[i].value;
            const verifier = () => testType(typeValueNode, signet);
            const result = verifyOrWarn(typeValueNode, verifier);

            results.push(result);
        }

        return results;
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

    function verifyObjectOrWarn(typeValueNode, verifier) {
        const typeValueIsObject = typeValueNode.type === 'ObjectExpression';

        if (typeValueIsObject) {
            return verifier();
        } else {
            const message = 'Unable to verify non-object duck type information';
            return buildError(message, typeValueNode.loc, 'warn');
        }
    }

    return {
        testDuckType: signet.enforce(
            'astNode, signet => array<LintErrorOrNull>',
            testDuckType),
        testSignature: signet.enforce(
            'astNode, signet => LintErrorOrNull',
            testSignature),
        testType: signet.enforce(
            'astNode, signet => LintErrorOrNull',
            testType),
        verifyOrWarn: signet.enforce(
            'astNode, verifier => LintErrorOrNull',
            verifyOrWarn),
        verifyObjectOrWarn: signet.enforce(
            'astNode, verifier => array<LintErrorOrNull>',
            verifyObjectOrWarn)
    }
}

module.exports = verifiers;
