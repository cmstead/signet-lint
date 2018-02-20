'use strict';

function testFn(a, b) {
    return a + b;
}

signet.extend('fleem', () => true);
signet.subtype('glurp')('foop', () => true);
signet.alias('zoinks{1}', 'slurm');

const int = 'int';

const isInt = signet.isTypeOf(`${int}`);
const isFlarb = signet.isTypeOf('flarb');
const isFleem = signet.isTypeOf('glurp');
const isFoop = signet.isTypeOf('foop');

signet.defineDependentOperatorOn('squanch')('=', () => true);
signet.defineDependentOperatorOn('flarp')('=', () => true);

signet.defineDuckType('dinglebop', {
    good: 'fleem',
    bad: 'florp',
    warn: () => true
});

signet.defineExactDuckType('plumbus', {
    woot: 'foop'
});

signet.defineRecursiveType('julia', () => null, 'blerf');

const test = signet.verifyValueType('dinglebop')('testing');
const test2 = signet.verifyValueType('?int')(undefined);

module.exports = {
    testFn: signet.enforce(
        'A %# B :: A: squanch, B: slurm => foo', 
        testFn)
}