'use strict';

const signet = require('signet')();

signet.alias('source', 'string');
signet.alias('errorMessage', 'string');
signet.alias('verifier', 'function');
signet.alias('methodName', 'string');

require('./type-data/astTypes')(signet);

signet.defineDuckType('signet', {
    enforce: 'function',
    isType: 'function'
});

signet.defineDuckType('lintError', {
    error: 'errorMessage',
    errorLevel: 'formattedString<(warn|error)>',
    loc: 'astLoc'
});

module.exports = signet;
