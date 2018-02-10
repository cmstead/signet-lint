'use strict';

const signet = require('../signet-types');

const first = (values) => values[0];
const rest = (values) => values.slice(1);

const checkPropertyName =
    (methodName) =>
        (astNode) =>
            astNode.callee.property.name === methodName;

module.exports = {
    checkPropertyName: signet.enforce(
        'methodName => astNode => boolean',
        checkPropertyName),
    first: signet.enforce(
        'array<*> => *',
        first),
    rest: signet.enforce(
        'array<*> => array<*>',
        rest)
}