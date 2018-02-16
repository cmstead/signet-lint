'use strict';

const signet = require('../signet-types');

const first = (values) => values[0];
const rest = (values) => values.slice(1);
const isDefined = signet.isTypeOf('not<undefined>');

const checkPropertyName =
    (methodName) =>
        (astNode) =>
            isDefined(astNode.callee.property)
            && astNode.callee.property.name === methodName;

const isCurriedExpression = signet.isTypeOf('signetCurriedCallExpression');

function checkCurriedPropertyName(propertyName) {
    const isCorrectNodeType = checkPropertyName(propertyName);
    return (node) => isCurriedExpression(node) && isCorrectNodeType(node.callee);
}

function buildError(message, location, errorLevel = 'error') {
    return {
        error: message,
        errorLevel: errorLevel,
        loc: location
    };
}

module.exports = {
    buildError: signet.enforce(
        'errorMessage, astLoc, [errorLevel] => lintError',
        buildError),
    checkPropertyName: signet.enforce(
        'methodName => astNode => boolean',
        checkPropertyName),
    checkCurriedPropertyName: signet.enforce(
        'methodName => astNode => boolean',
        checkCurriedPropertyName),
    first: signet.enforce(
        'array<*> => *',
        first),
    rest: signet.enforce(
        'array<*> => array<*>',
        rest)
}