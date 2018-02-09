'use strict';

const assert = require('chai').assert;
const prettyJson = require('./test-utils/prettyJson');
const sinon = require('sinon');

const signetLint = require('../index.js');

describe('signet-lint', function () {
    require('./test-utils/approvals-config');
});
