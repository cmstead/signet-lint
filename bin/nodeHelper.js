'use strict';

const signet = require('../signet-types');
const nodeIdentifier = require('./signetNodeIdentifiers');
const estraverse = require('estraverse');

const isSignetCall = signet.isTypeOf('signetCallExpression');
const isSignetCurriedCall = signet.isTypeOf('signetCurriedCallExpression');

function lintSignetNodes(ast, lintAction) {
    estraverse.traverse(ast, {
        enter: function (node) {
            if (isSignetCall(node) || isSignetCurriedCall(node)) {
                const nodeType = nodeIdentifier.getNodeType(node);
                if(nodeType !== 'default') {
                    lintAction(node, nodeType);
                }
            }
        }
    });
}

module.exports = {
    lintSignetNodes: signet.enforce(
        'ast, lintAction => undefined',
        lintSignetNodes)
}