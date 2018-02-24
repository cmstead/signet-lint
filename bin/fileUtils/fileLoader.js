'use strict';

function fileLoader(
    fs,
    globber,
    signet) {
    
    function fileNameToSource(fileName) {
        const source = fs.readFileSync(fileName, { encoding: 'utf8' });
        return [fileName, source];
    }

    function loadFileSource(globPatterns, callback) {
        globber.globFiles(globPatterns, function (error, files) {
            const sourceData = files.map(fileNameToSource, []);
            callback(null, sourceData);
        });
    }

    return {
        loadFileSource: signet.enforce(
            'array<globPattern>, callback => undefined',
            loadFileSource)
    }
}

module.exports = fileLoader;