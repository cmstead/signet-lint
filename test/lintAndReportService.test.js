'use strict';

const prettyJson = require('./test-utils/prettyJson');

const container = require('../container');

const lintAndReportService = container.build('lintAndReportService');

describe('lintAndReportService', function () {
    require('./test-utils/approvals-config');

    let lintConfig;

    beforeEach(function () {
        lintConfig = {
            typeFiles: ['./test/fixtures/types/*.js'],
            sourceFiles: ['./test/fixtures/testSource.js']
        };
    });

    
    describe('reportAsJson', function () {
        it('should collect and lint files, return JSON results', function (done) {
            
            lintAndReportService.reportAsJson(lintConfig, function (error, data) {
                this.verify(prettyJson(data));
                done();
            }.bind(this));

        });
    });
    
    describe('reportAsCLI', function () {
        it('should collect and lint files, return CLI results', function (done) {
            
            lintAndReportService.reportAsCLI(lintConfig, function (error, data) {
                this.verify(prettyJson(data));
                done();
            }.bind(this));

        });
    });
    
});
