'use strict';

module.exports = function(signet) {
    signet.alias('callExpressionNode', 'typedAstNode<CallExpression>');
    signet.alias('memberExpressionNode', 'typedAstNode<MemberExpression>');
    signet.alias('identifierNode', 'typedAstNode<Identifier>');

    const isMemberExpression = signet.isTypeOf('memberExpressionNode');
    const isIdentifier = signet.isTypeOf('identifierNode');
    const isCallExpression = signet.isTypeOf('callExpressionNode');

    signet.subtype('callExpressionNode')('curriedCallExpressionNode', function(astNode) {
        return isCallExpression(astNode.callee);
    });
    
    signet.subtype('callExpressionNode')('signetCallExpression', function(value) {
        return isMemberExpression(value.callee)
            && isIdentifier(value.callee.object)
            && value.callee.object.name === 'signet';
    });
    
    const isSignetCallExpression = signet.isTypeOf('signetCallExpression');

    signet.subtype('callExpressionNode')('signetCurriedCallExpression', function (value) {
        return isSignetCallExpression(value.callee);
    });
}