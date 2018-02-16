'use strict';

const signet = require('../signet-types');
const nodeIdentifier = require('./signetNodeIdentifiers');
const estraverse = require('estraverse');

const isSignetCall = signet.isTypeOf('signetCallExpression');
const isSignetCurriedCall = signet.isTypeOf('signetCurriedCallExpression');

function lintOnValidNode(node, lintAction) {
    const nodeType = nodeIdentifier.getNodeType(node);

    if (nodeType !== 'default') {
        lintAction(node, nodeType);
    }
}

function lintIfSignetNode(lintAction) {
    return function (node) {
        if (isSignetCall(node) || isSignetCurriedCall(node)) {
            lintOnValidNode(node, lintAction)
        }
    };
}

function lintSignetNodes(ast, lintAction) {
    estraverse.traverse(ast, {
        enter: lintIfSignetNode(lintAction)
    });
}

module.exports = {
    lintSignetNodes: signet.enforce(
        'ast, lintAction => undefined',
        lintSignetNodes)
}