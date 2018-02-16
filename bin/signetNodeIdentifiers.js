'use strict';

const signet = require('../signet-types');

const nodeStandardSignetTypes = {
    'enforce': true,
    'sign': true,
    'isTypeOf': true,
    'verifyValueType': true,
    'alias': true,
    'defineDuckType': true,
    'defineExactDuckType': true,
    'extend': true,
    'defineRecursiveType': true
};

const nodeCurriedSignetTypes = {
    'subtype': true,
    'defineDependentOperatorOn': true
}

const isCurriedCallExpression = signet.isTypeOf('curriedCallExpressionNode');
const isDefined = signet.isTypeOf('not<undefined>');

function getPropertyName(node) {
    return isDefined(node.callee.property)
        ? node.callee.property.name
        : '';
}

function passThroughNameOrDefault(obj, name) {
    return typeof obj[name] === 'undefined' ? 'default' : name;
}

function getNodeType(node) {
    if (isCurriedCallExpression(node)) {
        const nodeType = getPropertyName(node.callee);
        return passThroughNameOrDefault(nodeCurriedSignetTypes, nodeType);
    } else {
        const nodeType = getPropertyName(node);
        return passThroughNameOrDefault(nodeStandardSignetTypes, nodeType);
    }
}

module.exports = {
    getNodeType: signet.enforce(
        'astNode => string',
        getNodeType)
}