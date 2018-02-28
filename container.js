'use strict'

var config = {
    cwd: __dirname,
    modulePaths: [
        'bin',
        'bin/cli',
        'bin/reporters',
        'bin/moduleWrappers',
        'bin/astUtils',
        'bin/fileUtils',
        'bin/typeUtils',
        'bin/verificationUtils'
    ],
    allowOverride: false,
    eagerLoad: false
};

module.exports = require('dject').new(config);