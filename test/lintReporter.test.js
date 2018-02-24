'use strict';

const prettyJson = require('./test-utils/prettyJson');
const sourceReader = require('./test-utils/sourceReader');

const container = require('../container');

const lintSource = container.build('lintSource');
const globToSignetNodes = container.build('globToSignetNodes');
const lintReporter = container.build('lintReporter');

require('./test-utils/approvals-config');

describe('lintReporter', function () {

    
    it('should generate a human-readable lint report', function (done) {
        const fileSource = sourceReader.readSource(__dirname, './fixtures/testSource.js');

        globToSignetNodes
            .getSignetNodes(['./test/fixtures/types/*.js'], function (error, typeNodes) {
                const errorOutput = lintSource.loadTypesAndLint(typeNodes, fileSource);
                const lintReport = lintReporter.buildReport(errorOutput);

                this.verify(prettyJson(lintReport));

                done();
            }.bind(this));
    });
    

});
