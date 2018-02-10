'use strict';

function testFn(a, b) {
    return a + b;
}

signet.extend('fleem', () => true);
signet.subtype('slurm')('foop', () => true);
signet.alias('zoinks', 'slurm');

const int = 'int';

const isInt = signet.isTypeOf(`${int}`);
const isFlarb = signet.isTypeOf('flarb');
const isFleem = signet.isTypeOf('fleem');
const isFoop = signet.isTypeOf('foop');

const test = signet.verifyValueType('slurm')('testing');
const test2 = signet.verifyValueType('?int')(undefined);

module.exports = {
    testFn: signet.enforce(
        'foo, number => number', 
        testFn)
}