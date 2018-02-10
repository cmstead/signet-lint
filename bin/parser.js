'use strict';

const signet = require('../signet-types');
const esprima = require('esprima');

function parseSource(source) {
    let ast;
    const parserOptions = {
        jsx: true,
        loc: true,
        tolerant: true
    };

    try{
        ast = esprima.parseScript(source, parserOptions);
    } catch (e) {
        ast = esprima.parseModule(source, parserOptions);
    }

    return ast;
}

module.exports = {
    parseSource: signet.enforce(
        'source => ast',
        parseSource)
}
