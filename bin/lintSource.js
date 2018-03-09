'use strict';

function lintSource(
    nodeHelper,
    parser,
    signet,
    signetBuilder,
    typeLoader,
    utils,
    verifier
) {

    const { buildError } = utils;

    function verifyBuilder(signet) {
        return function (node, nodeType) {
            return verifier.verify(node, signet, nodeType);
        };
    }

    function errorOnLoadMethod(node, nodeType) {
        const message = `Method ${nodeType} used: Cannot create new type in source files.`
        return typeLoader.isTypeLoader(nodeType)
            ? buildError(message, node.loc)
            : null;
    }

    function getLintResult(signet) {
        const verify = verifyBuilder(signet);

        return function (results, node, nodeType) {
            return results
                .concat(errorOnLoadMethod(node, nodeType))
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

    function loadTypesAndLint(typeFileData, fileSource) {
        const localSignet = signetBuilder();
        typeLoader.loadTypeNodes(typeFileData, localSignet);
        return verify(fileSource, localSignet);
    }

    return {
        loadTypesAndLint: signet.enforce(
            'typeFileData, source => array<lintError>',
            loadTypesAndLint),

        verify: signet.enforce(
            'source, signet: object => array<lintError>',
            verify)
    };
}

module.exports = lintSource;