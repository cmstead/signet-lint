'use strict';

const signet = require('../signet-types');
const estraverse = require('estraverse');

function isSignetCall(node) {
    return node.type === 'CallExpression'
        && node.callee.type === 'MemberExpression'
        && node.callee.object.type === 'Identifier'
        && node.callee.object.name === 'signet';
}

function collectSignetNodes(ast) {
    const signetNodes = [];

    estraverse.traverse(ast, {
        enter: function (node) {
            if (isSignetCall(node)) {
                signetNodes.push(node);
            }
        }
    });

    return signetNodes;
}

module.exports = {
    collectSignetNodes: signet.enforce(
        'ast => array<astNode>',
        collectSignetNodes)
}