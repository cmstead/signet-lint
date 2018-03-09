'use strict';

function fileLoader(
    fs,
    globber,
    signet) {

    function fileNameToSource(fileName, callback) {
        fs.readFile(fileName, { encoding: 'utf8' }, function (error, source) {
            callback(error, [fileName, source]);
        });
    }

    function buildNextCall(remainingFiles, result, callback) {
        return function (error, data) {
            if (error) {
                callback(error);
            } else {
                result.push(data);
                loadAllFiles(remainingFiles, result, callback);
            }
        };
    }

    function loadAllFiles(fileNames, result, callback) {
        const nextFile = fileNames[0];
        const remainingFiles = fileNames.slice(1);

        if (fileNames.length > 0) {
            const nextCall = buildNextCall(remainingFiles, result, callback);
            fileNameToSource(nextFile, nextCall);
        } else {
            callback(null, result);
        }
    }

    function loadFileSource(globPatterns, callback) {
        globber.globFiles(globPatterns, function (error, files) {
            if (error) {
                callback(error);
            } else {
                loadAllFiles(files, [], callback);
            }
        });
    }

    const isString = signet.isTypeOf('string');

    function loadIterateableFileData(globPatterns, callback) {
        globber.globFiles(globPatterns, function (error, files) {
            let offset = 0;

            if (error) {
                callback(error);
            } else {
                const getPathThenIncrement = () => files[offset++];

                const getNext = (callback) =>
                    isString(files[offset])
                        ? fileNameToSource(getPathThenIncrement(), callback)
                        : callback(null, null);

                callback(null, getNext);
            }
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