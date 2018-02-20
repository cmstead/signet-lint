module.exports = function (signet) {

    signet.alias('errorMessage', 'string');
    signet.alias('nodeType', 'string');
    signet.alias('errorLevel', 'formattedString<(warn|error)>');
    signet.alias('lintAction', 'function<astNode, nodeType => *>');

    signet.defineDuckType('lintError', {
        error: 'errorMessage',
        errorLevel: 'errorLevel',
        loc: 'astLoc'
    });

    signet.alias('LintErrorOrNull', 'variant<lintError, null>');

    signet.defineDuckType('nodeWrapper', {
        type: 'nodeType',
        node: 'astNode'
    });

}