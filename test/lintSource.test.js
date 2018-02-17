'use strict';

const signetBuilder = require('signet');
const prettyJson = require('./test-utils/prettyJson');
const sourceReader = require('./test-utils/sourceReader');

const lintSource = require('../bin/lintSource.js');

require('./test-utils/approvals-config');

describe('lintSource', function () {

    const typeFnBuilder = () => () => true;

    function loadTypes(types, signet) {
        types.forEach(type => signet.extend(type, typeFnBuilder()));
    }

    it('should lint clean on JS with good type info', function() {
        const fileSource = sourceReader.readSource(__dirname, './fixtures/testSource.js');
        const signet = signetBuilder();
        const globallyDefinedTypes = ['foo', 'flarb', 'flarp', 'squanch', 'florp', 'glurp', 'slurm'];
        
        loadTypes(globallyDefinedTypes, signet);

        const errorOutput = lintSource.verify(fileSource, signet);

        this.verify(prettyJson(errorOutput));
    });

    it('should lint dirty on good JS with bad type info', function() {
        const fileSource = sourceReader.readSource(__dirname, './fixtures/testSource.js');
        const signet = signetBuilder();

        // This is necessary to generate failing case
        // Creating dependent operator against existing definition
        signet.extend('squanch', () => true);
        signet.defineDependentOperatorOn('squanch')('=', () => true);

        const errorOutput = lintSource.verify(fileSource, signet);

        this.verify(prettyJson(errorOutput));
    });
});
