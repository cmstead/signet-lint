'use strict';

const signet = require('../signet-types');
// const nodeIdentifier = require('./signetNodeIdentifiers');
const { buildError } = require('./utils');

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

function getLoaderMethod(node, nodeType) {
    // const nodeType = nodeIdentifier.getNodeType(node);
    const loader = loaderMethodMap[nodeType]

    return typeof loader === 'undefined' ? defaultLoader : loader;
}

function loadTypeNode(node, signet, nodeType) {
    return getLoaderMethod(node, nodeType)(node, signet);
}

module.exports = {
    loadTypeNode: signet.enforce(
        'astNode, signet => variant<null, lintError>',
        loadTypeNode),
    loadTypeName: signet.enforce(
        'typeName, signet => variant<null, errorMessage>',
        loadTypeName)
}

