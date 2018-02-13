'use strict';

module.exports = function(signet) {

    signet.defineDuckType('astPosition', {
        line: 'leftBoundedInt<1>',
        column: 'leftBoundedInt<0>',
    });
    
    signet.defineDuckType('astLoc', {
        start: 'astPosition',
        end: 'astPosition'
    });
    
    signet.alias('shallowAstLoc', 'objectInstance');

    signet.defineDuckType('astNode', {
        type: '?string',
        loc: 'shallowAstLoc'
    });

    signet.defineDuckType('ast', {
        type: 'formattedString<Program>',
        body: 'array<astNode>',
    });

    signet.subtype('astNode')('typedAstNode{1}', function (value, options) {
        return value.type === options[0];
    });
}