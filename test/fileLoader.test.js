'use strict';

const prettyJson = require('./test-utils/prettyJson');

const container = require('../container');
const fileLoader = container.build('fileLoader');

require('./test-utils/approvals-config');

describe('fileLoader', function () {

    it('should load source for all files matching glob pattern', function (done) {
        fileLoader
            .loadFileSource(
                ['./test/fixtures/*.js'],
                function (error, fileSource) {
                    const result = prettyJson(fileSource);
                    this.verify(result);
                    done();
                }.bind(this));
    });


    it('should load source for all files matching using multiple patterns', function (done) {
        fileLoader
            .loadFileSource(
                [
                    './test/fixtures/types/*.js',
                    './test/fixtures/*.js'
                ],
                function (error, fileSource) {
                    const result = prettyJson(fileSource);
                    this.verify(result);
                    done();
                }.bind(this));
    });


});
