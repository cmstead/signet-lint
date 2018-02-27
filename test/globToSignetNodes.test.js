'use strict';

const prettyJson = require('./test-utils/prettyJson');

const container = require('../container');

const globToSignetNodes = container.build('globToSignetNodes');

require('./test-utils/approvals-config');

describe('globToSignetNodes', function () {

    it('should load signet nodes from the ast using file globbing', function (done) {
        globToSignetNodes
            .getSignetNodes(
                ['./test/fixtures/*.js'],
                function (error, data) {
                    const result = prettyJson(data);
                    this.verify(result);
                    done();
                }.bind(this));
    });

    
    it('should load signet nodes from multiple glob patterns', function (done) {
        globToSignetNodes
        .getSignetNodes(
            [
                './test/fixtures/types/*.js',
                './test/fixtures/*.js'
            ],
            function (error, data) {
                const result = prettyJson(data);
                this.verify(result);
                done();
            }.bind(this));

    });
    

});
