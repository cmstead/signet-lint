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
    
    signet.defineDuckType('astNode', {
        type: '?string',
        loc: 'astLoc'
    });
    
    signet.defineDuckType('ast', {
        type: 'formattedString<Program>',
        body: 'array<astNode>',
    });
    
}