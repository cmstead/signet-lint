'use strict';

function testFn(a, b) {
    return a + b;
}

signet.extend('fleem', () => true);
signet.subtype('slurm')('foop', () => true);

const int = 'int';

const isInt = signet.isTypeOf(`${int}`);
const isFlarb = signet.isTypeOf('flarb');
const isFleem = signet.isTypeOf('fleem');
const isFoop = signet.isTypeOf('foop');

module.exports = {
    testFn: signet.enforce(
        'foo, number => number', 
        testFn)
}