'use strict';

const signet = require('../signet-types');
const nodeIdentifier = require('./signetNodeIdentifiers');
const estraverse = require('estraverse');

const isSignetCall = signet.isTypeOf('signetCallExpression');
const isSignetCurriedCall = signet.isTypeOf('signetCurriedCallExpression');

function lintOnValidNode(node, signetNodeAction) {
    const nodeType = nodeIdentifier.getNodeType(node);

    if (nodeType !== 'default') {
        signetNodeAction(node, nodeType);
    }
}

function lintIfSignetNode(signetNodeAction) {
    return function (node) {
        if (isSignetCall(node) || isSignetCurriedCall(node)) {
            lintOnValidNode(node, signetNodeAction)
        }
    };
}

function callOnSignetNodes(ast, signetNodeAction) {
    estraverse.traverse(ast, {
        enter: lintIfSignetNode(signetNodeAction)
    });
}

module.exports = {
    callOnSignetNodes: signet.enforce(
        'ast, lintAction => undefined',
        callOnSignetNodes)
}