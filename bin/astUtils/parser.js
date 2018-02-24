'use strict';

function parser(
    esprima,
    signet) {

    function parseSource(source) {
        let ast;
        const parserOptions = {
            jsx: true,
            loc: true,
            tolerant: true
        };

        try {
            ast = esprima.parseScript(source, parserOptions);
        } catch (e) {
            ast = esprima.parseModule(source, parserOptions);
        }

        return ast;
    }

    return {
        parseSource: signet.enforce(
            'source => ast',
            parseSource)
    };
}

module.exports = parser;
