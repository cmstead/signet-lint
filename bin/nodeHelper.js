'use strict';

const signet = require('../signet-types');
const estraverse = require('estraverse');

const isSignetCall = signet.isTypeOf('signetCallExpression');
const isSignetCurriedCall = signet.isTypeOf('signetCurriedCallExpression');

function lintSignetNodes(ast, lintAction) {
    estraverse.traverse(ast, {
        enter: function (node) {
            if (isSignetCall(node) || isSignetCurriedCall(node)) {
                lintAction(node);
            }
        }
    });
}

module.exports = {
    lintSignetNodes: signet.enforce(
        'ast, lintAction => undefined',
        lintSignetNodes)
}