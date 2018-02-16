'use strict';

const signet = require('../signet-types');
const {
    checkCurriedPropertyName,
    checkPropertyName
} = require('./utils');

const isEnforcement = checkPropertyName('enforce');
const isSigning = checkPropertyName('sign');
const isTypeCheck = checkPropertyName('isTypeOf');
const isVerifyValueType = checkPropertyName('verifyValueType');

const isAliasDeclaration = checkPropertyName('alias');
const isDuckTypeDeclaration = checkPropertyName('defineDuckType');
const isExactDuckTypeDeclaration = checkPropertyName('defineExactDuckType');
const isExtendDeclaration = checkPropertyName('extend');
const isRecursiveTypeDeclaration = checkPropertyName('defineRecursiveType');

const isSubtypeDeclaration = checkCurriedPropertyName('subtype');
const isDependentOperatorDeclaration = checkCurriedPropertyName('defineDependentOperatorOn');

const nodeTypeMapping = [
    [isEnforcement, 'enforce'],
    [isSigning, 'sign'],
    [isTypeCheck, 'isTypeOf'],
    [isVerifyValueType, 'verifyValueType'],
    [isAliasDeclaration, 'alias'],
    [isDuckTypeDeclaration, 'defineDuckType'],
    [isExactDuckTypeDeclaration, 'defineExactDuckType'],
    [isExtendDeclaration, 'extend'],
    [isRecursiveTypeDeclaration, 'defineRecursiveType'],
    [isSubtypeDeclaration, 'subtype'],
    [isDependentOperatorDeclaration, 'defineDependentOperatorOn']
];

// const nodeStandardSignetTypes = {
//     'enforce': true,
//     'sign': true,
//     'isTypeOf': true,
//     'verifyValueType': true,
//     'alias': true,
//     'defineDuckType': true,
//     'defineExactDuckType': true,
//     'extend': true,
//     'defineRecursiveType': true
// };

// const nodeCurriedSignetTypes = {
//     'subtype': true,
//     'defineDependentOperatorOn': true
// }

function getNodeType(node) {
    let nodeType = 'default';

    for (let i = 0; i < nodeTypeMapping.length; i++) {
        const nodeTypeCheck = nodeTypeMapping[i][0];
        if (nodeTypeCheck(node)) {
            nodeType = nodeTypeMapping[i][1];
            break;
        }
    }

    return nodeType;
}

module.exports = {
    getNodeType: signet.enforce(
        'astNode => string',
        getNodeType)
}