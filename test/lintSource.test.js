'use strict';

const prettyJson = require('./test-utils/prettyJson');
const sourceReader = require('./test-utils/sourceReader');

const container = require('../container');

const lintSource = container.build('lintSource');
const globToSignetNodes = container.build('globToSignetNodes');

require('./test-utils/approvals-config');

describe('lintSource', function () {

    it('Should properly lint file with mixure of good and bad types', function (done) {
        const fileSource = sourceReader.readSource(__dirname, './fixtures/testSource.js');

        globToSignetNodes
            .getSignetNodes(['./test/fixtures/types/*.js'], function (error, typeNodes) {
                const errorOutput = lintSource.loadTypesAndLint(typeNodes, fileSource);

                this.verify(prettyJson(errorOutput));

                done();
            }.bind(this));
    });
});
