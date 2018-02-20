'use strict';

const signet = require('signet');

signet.extend('foo', () => true);
signet.subtype('foo')('flarb', () => true);
signet.defineDuckType('flarp', {});
signet.defineExactDuckType('squanch', {});
signet.alias('florp', 'squanch');
signet.defineRecursiveType('glurp', () => null, 'florp');
signet.extend('slurm', () => true);

signet.defineDependentOperatorOn('slurm', '%#', () => true);

module.exports = signet;