'use strict';

const signet = require('../signet-types');
const { checkPropertyName, buildError } = require('./utils');

const isAliasDeclaration = checkPropertyName('alias');
const isDuckTypeDeclaration = checkPropertyName('defineDuckType');
// const isExactDuckTypeDeclaration = checkPropertyName('defineExactDuckType');
const isExtendDeclaration = checkPropertyName('extend');
// const isRecursiveTypeDeclaration = checkPropertyName('defineRecursiveType');
// const isSubtypeDeclaration = checkPropertyName('subtype');

// const isDependentOperatorDeclaration = checkPropertyName('defineDependentOperatorOn');
// const isMacroDeclaration = checkPropertyName('registerTypeLevelMacro');

function loadTypeName(typeName, signet) {
    try {
        signet.extend(typeName, () => true);
        return null;
    } catch (e) {
        return e.message;
    }
}

function loadTypeOrError(typeName, astLoc, signet) {
    const errorMessage = loadTypeName(typeName.value, signet);
    return errorMessage !== null
        ? buildError(errorMessage, astLoc)
        : null;
}

function loadNameFromFirstArgument(node, signet) {
    const typeName = node.arguments[0];
    return loadTypeOrError(typeName, typeName.loc, signet);
}

const isDefault = () => true;
const defaultLoader = () => null;

const loaderMethods = [
    [isAliasDeclaration, loadNameFromFirstArgument],
    [isExtendDeclaration, loadNameFromFirstArgument],
    [isDuckTypeDeclaration, loadNameFromFirstArgument],
    [isDefault, defaultLoader]
];

function getLoaderMethod(node) {
    let loader;

    for (let i = 0; i < loaderMethods.length; i++) {
        let verificationCheck = loaderMethods[i][0];

        if (verificationCheck(node)) {
            loader = loaderMethods[i][1];
            break;
        }
    }

    return loader;
}

function loadTypeNode(node, signet) {
    return getLoaderMethod(node)(node, signet);
}

module.exports = {
    loadTypeNode: signet.enforce(
        'astNode, signet => variant<null, lintError>',
        loadTypeNode),
    loadTypeName: signet.enforce(
        'typeName, signet => variant<null, errorMessage>',
        loadTypeName)
}

