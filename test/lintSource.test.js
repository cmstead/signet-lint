'use strict';

const signetBuilder = require('signet');
const prettyJson = require('./test-utils/prettyJson');
const sourceReader = require('./test-utils/sourceReader');

const lintSource = require('../bin/lintSource.js');

describe('lintSource', function () {
    require('./test-utils/approvals-config');

    const typeFnBuilder = () => () => true;

    function loadTypes(types, signet) {
        types.forEach(type => signet.extend(type, typeFnBuilder()));
    }

    it('should lint clean on JS with good type info', function() {
        const fileSource = sourceReader.readSource(__dirname, './fixtures/testSource.js');
        const signet = signetBuilder();
        const testTypes = ['foo', 'flarb', 'slurm', 'foop'];
        
        loadTypes(testTypes, signet);

        const errorOutput = lintSource.verify(fileSource, signet);

        this.verify(prettyJson(errorOutput));
    });

    it('should lint dirty on good JS with bad type info', function() {
        const fileSource = sourceReader.readSource(__dirname, './fixtures/testSource.js');
        const signet = signetBuilder();
        const testTypes = ['foop'];
        
        loadTypes(testTypes, signet);

        const errorOutput = lintSource.verify(fileSource, signet);

        this.verify(prettyJson(errorOutput));
    });
});