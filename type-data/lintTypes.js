module.exports = function (signet) {

    signet.alias('errorMessage', 'string');
    signet.alias('errorLevel', 'formattedString<(warn|error)>');
    signet.alias('lintAction', 'function<node => *>');

    signet.defineDuckType('lintError', {
        error: 'errorMessage',
        errorLevel: 'errorLevel',
        loc: 'astLoc'
    });

    signet.alias('LintErrorOrNull', 'variant<lintError, null>');

}