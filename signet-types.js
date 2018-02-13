'use strict';

const signet = require('signet')();

signet.alias('source', 'string');
signet.alias('errorMessage', 'string');
signet.alias('errorLevel', 'formattedString<(warn|error)>');
signet.alias('verifier', 'function');
signet.alias('methodName', 'string');
signet.alias('typeName', 'string');
signet.alias('lintAction', 'function<node => *>');
signet.alias('objectInstance', 'composite<not<null>, object>');

signet.defineDuckType('signet', {
    enforce: 'function',
    isType: 'function'
});

require('./type-data/astTypes')(signet);
require('./type-data/nodeTypes')(signet);

signet.defineDuckType('lintError', {
    error: 'errorMessage',
    errorLevel: 'errorLevel',
    loc: 'astLoc'
});

signet.alias('LintErrorOrNull', 'variant<lintError, null>');

module.exports = signet;
