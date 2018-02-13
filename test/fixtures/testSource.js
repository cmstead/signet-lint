'use strict';

function testFn(a, b) {
    return a + b;
}

signet.extend('fleem', () => true);
signet.subtype('glurp')('foop', () => true);
signet.alias('zoinks', 'slurm');

const int = 'int';

const isInt = signet.isTypeOf(`${int}`);
const isFlarb = signet.isTypeOf('flarb');
const isFleem = signet.isTypeOf('fleem');
const isFoop = signet.isTypeOf('foop');

signet.defineDuckType('dinglebop', {
    good: 'fleem',
    bad: 'florp',
    warn: () => true
});

const test = signet.verifyValueType('dinglebop')('testing');
const test2 = signet.verifyValueType('?int')(undefined);

module.exports = {
    testFn: signet.enforce(
        'zoinks, fleem => foo', 
        testFn)
}