'use strict';

function typeLoader(
    signet,
    utils) {

    const { buildError } = utils;

    function loadTypeName(typeName, signet) {
        try {
            signet.extend(typeName, () => true);
            return null;
        } catch (e) {
            return e.message;
        }
    }

    function loadTypeOrError(typeName, signet) {
        const errorMessage = loadTypeName(typeName.value, signet);
        return errorMessage !== null
            ? buildError(errorMessage, typeName.loc)
            : null;
    }

    function loadNameFromFirstArgument(node, signet) {
        const typeName = node.arguments[0];
        return loadTypeOrError(typeName, signet);
    }

    function loadDependentOperator(node, signet) {
        const operator = node.arguments[0];
        const typeName = node.callee.arguments[0];

        try {
            signet.defineDependentOperatorOn(typeName.value)(operator.value, () => true);
            return null;
        } catch (e) {
            return buildError(e.message, operator.loc);
        }
    }

    const defaultLoader = () => null;

    const loaderMethodMap = {
        alias: loadNameFromFirstArgument,
        extend: loadNameFromFirstArgument,
        defineDuckType: loadNameFromFirstArgument,
        defineExactDuckType: loadNameFromFirstArgument,
        defineRecursiveType: loadNameFromFirstArgument,
        subtype: loadNameFromFirstArgument,
        defineDependentOperatorOn: loadDependentOperator,
        default: defaultLoader
    };

    const isUndefined = signet.isTypeOf('undefined');

    function getLoaderMethod(node, nodeType) {
        const loader = loaderMethodMap[nodeType]

        return isUndefined(loader) ? defaultLoader : loader;
    }

    function loadTypeNode(node, signet, nodeType) {
        const loaderMethod = getLoaderMethod(node, nodeType);
        return loaderMethod(node, signet);
    }

    function loadTypeNodes(typeFileData, signet) {
        typeFileData.forEach(function (fileNodes) {
            fileNodes[1].forEach(function (nodeWrapper) {
                loadTypeNode(nodeWrapper.node, signet, nodeWrapper.type);
            });
        });
    }

    function isTypeLoader(nodeType) {
        return !isUndefined(loaderMethodMap[nodeType]);
    }

    return {
        isTypeLoader: signet.enforce(
            'nodeType => boolean',
            isTypeLoader),

        loadTypeNodes: signet.enforce(
            'typeFileData, signet => undefined',
            loadTypeNodes),

        loadTypeNode: signet.enforce(
            'astNode, signet => variant<null, lintError>',
            loadTypeNode),

        loadTypeName: signet.enforce(
            'typeName, signet => variant<null, errorMessage>',
            loadTypeName)
    }
}

module.exports = typeLoader;
