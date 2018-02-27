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

    const isString = signet.isTypeOf('string');

    function loadIterateableFileData(globPatterns, callback) {
        globber.globFiles(globPatterns, function (error, files) {
            let offset = 0;
            
            const getPathThenIncrement = () => files[offset++];
            const getNext = () => 
                isString(files[offset])
                    ? fileNameToSource(getPathThenIncrement())
                    : null;

            callback(error, getNext);
        });
    }

    return {
        loadFileSource: signet.enforce(
            'array<globPattern>, callback => undefined',
            loadFileSource),
        loadIterateableFileData: signet.enforce(
            'array<globPattern>, callback => undefined',
            loadIterateableFileData)
    }
}

module.exports = fileLoader;