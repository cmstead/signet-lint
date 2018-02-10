'use strict';

const fs = require('fs');

function readSource(basePath, filepath) {
    return fs.readFileSync(`${basePath}/${filepath}`, { encoding: 'utf8' });
}

module.exports = {
    readSource: readSource
}

