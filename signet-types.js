'use strict';

const signet = require('signet')();

signet.defineDuckType('error', {
    message: 'string'
});

signet.alias('maybeError', 'variant<null, error>')
signet.alias('callback', 'function<maybeError, [*] => undefined>');
signet.alias('objectInstance', 'composite<not<null>, object>');

signet.alias('globPattern', 'string');
signet.alias('methodName', 'string');
signet.alias('source', 'string');
signet.alias('typeName', 'string');
signet.alias('typeFileData', 'array<tuple<string, array>>');
signet.alias('verifier', 'function');

signet.defineDuckType('signet', {
    enforce: 'function',
    isType: 'function'
});

require('./type-data/astTypes')(signet);
require('./type-data/nodeTypes')(signet);
require('./type-data/lintTypes')(signet);

module.exports = signet;
