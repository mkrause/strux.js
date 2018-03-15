// @flow
declare var describe: any;
declare var it: any;

import chai, { assert, expect } from 'chai';

import Record from '../../src/structures/Record.js';


describe('Record', () => {
    describe('constructor', () => {
        it('should fail on empty arguments', () => {
            expect(() => {
                // $FlowFixMe
                const record1 = new Record();
            }).to.throw(TypeError);
        });
        
        it('should not allow the construction of an empty Record', () => {
            expect(() => {
                const record1 = new Record({});
            }).to.throw(TypeError);
        });
        
        it('should construct a Record from a nonempty object of properties', () => {
            expect(() => {
                const record1 = new Record({
                    foo: 42,
                    bar: 43,
                });
            }).to.not.throw();
        });
    });
    
    describe('hash()', () => {
        // Note: hashes are not guaranteed to be stable, so the hardcoded hashes below
        // may fail at some point (which is fine).
        
        it('should return the hash', () => {
            const record1 = new Record({
                foo: 42,
                bar: 43,
            });
            
            expect(record1.hash()).to.equal('1c114e9dc3c80493353cfdf0ca738bdd78dd2b02');
        });
    });
    
    describe('equals()', () => {
        it('should return false if the given record does not have the same size', () => {
            const record1 = new Record({
                foo: 42,
                bar: 43,
                baz: 44,
            });
            
            const record2 = new Record({
                foo: 42,
                baz: 43,
            });
            
            expect(record1).to.not.satisfy(subject => subject.equals(record2));
        });
        
        it('should return false if the given record does not have equal keys', () => {
            const record1 = new Record({
                foo: 42,
                bar: 43,
            });
            
            const record2 = new Record({
                foo: 42,
                baz: 43,
            });
            
            expect(record1).to.not.satisfy(subject => subject.equals(record2));
        });
        
        it('should return false if the given record does not have equal values', () => {
            const record1 = new Record({
                foo: 42,
                bar: 43,
            });
            
            const record2 = new Record({
                foo: 42,
                bar: 44,
            });
            
            expect(record1).to.not.satisfy(subject => subject.equals(record2));
        });
        
        it('should return true if the given record has equal properties', () => {
            const record1 = new Record({
                foo: 42,
                bar: 43,
            });
            
            const record2 = new Record({
                foo: 42,
                bar: 43,
            });
            
            expect(record1).to.satisfy(subject => subject.equals(record2));
        });
    });
    
    describe('ordering', () => {
        // Record is supposed to be an ordered type. That is, the order of the properties
        // should be maintained.
        
        it('should be maintained for plain objects as much as ES6 ordering is allowed', () => {
            // JS objects are (as of the ES6 spec) ordered, with the caveat that number-like keys
            // are ordered first. We want to maintain the order, upto the differences due to these rules.
            // See: https://stackoverflow.com/questions/5525795/does-javascript-guarantee
            
            // Update: numeric record keys are not allowed at the moment anyway, so these
            // cases have been commented out.
            
            const record1 = new Record({
                //5: 41,
                foo: 42,
                bar: 43,
                //1: 44,
                //0: 45,
            });
            
            const record2 = new Record({
                //0: 45,
                //1: 44,
                //5: 41,
                foo: 42,
                bar: 43,
            });
            
            const record3 = new Record({
                //0: 45,
                //1: 44,
                //5: 41,
                bar: 43,
                foo: 42,
            });
            
            // `record1` and `record2` have the same order according to ES6 rules
            expect(record1.hash()).to.equal(record2.hash());
            expect(record1).to.satisfy(subject => subject.equals(record2));
            
            // `record1` and `record3` have the a different according to ES6 rules
            expect(record1.hash()).to.not.equal(record3.hash());
            expect(record1).to.not.satisfy(subject => subject.equals(record3));
        });
    });
    
    describe('toJSON()', () => {
        it('should return a JS object corresponding to the record properties', () => {
            const record1 = new Record({
                foo: 42,
                bar: 43,
            });
            
            expect(record1.toJSON()).to.deep.equal({
                foo: 42,
                bar: 43,
            });
        });
        
        it('should return the property value for an existing key', () => {
            const record1 = new Record({
                foo: 42,
                bar: 43,
            });
            
            expect(record1.get('foo')).to.equal(42);
        });
    });
    
    describe('size()', () => {
        it('should return the size of the record', () => {
            const record1 = new Record({
                foo: 42,
            });
            const record2 = new Record({
                foo: 42,
                bar: 43,
                baz: 44,
                qux: 45,
                quux: 46,
            });
            
            expect(record1.size()).to.equal(1);
            expect(record2.size()).to.equal(5);
        });
        
        it('should return the property value for an existing key', () => {
            const record1 = new Record({
                foo: 42,
                bar: 43,
            });
            
            expect(record1.get('foo')).to.equal(42);
        });
    });
    
    describe('has()', () => {
        it('should return false for a nonexisting key', () => {
            const record1 = new Record({
                foo: 42,
                bar: 43,
            });
            
            expect(record1.has('nonexistent')).to.be.false;
        });
        
        it('should return true for an existing key', () => {
            const record1 = new Record({
                foo: 42,
                bar: 43,
            });
            
            expect(record1.has('foo')).to.be.true;
        });
    });
    
    describe('get()', () => {
        it('should fail for a nonexisting key', () => {
            const record1 = new Record({
                foo: 42,
                bar: 43,
            });
            
            expect(() => {
                record1.get('nonexistent');
            }).to.throw(TypeError);
        });
        
        it('should return the property value for an existing key', () => {
            const record1 = new Record({
                foo: 42,
                bar: 43,
            });
            
            expect(record1.get('foo')).to.equal(42);
        });
    });
});
