'use strict';

function nodeHelper(estraverse, signet, signetNodeIdentifiers) {

    const isSignetCall = signet.isTypeOf('signetCallExpression');
    const isSignetCurriedCall = signet.isTypeOf('signetCurriedCallExpression');

    function lintOnValidNode(node, signetNodeAction) {
        const nodeType = signetNodeIdentifiers.getNodeType(node);

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

    return {
        callOnSignetNodes: signet.enforce(
            'ast, lintAction => undefined',
            callOnSignetNodes)
    };
}

module.exports = nodeHelper;