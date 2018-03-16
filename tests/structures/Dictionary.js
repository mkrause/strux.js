// @flow
declare var describe: any;
declare var it: any;

import chai, { assert, expect } from 'chai';

import Dictionary from '../../src/structures/Dictionary.js';


describe('Dictionary', () => {
    describe('constructor', () => {
        it('should fail on empty arguments', () => {
            expect(() => {
                // $FlowFixMe
                const dict1 = new Dictionary();
            }).to.throw(TypeError);
        });
        
        it('should not allow the construction of an empty Dictionary', () => {
            expect(() => {
                const dict1 = new Dictionary({});
            }).to.throw(TypeError);
            
            expect(() => {
                const dict1 = new Dictionary(new Map());
            }).to.throw(TypeError);
        });
        
        it('should construct a Dictionary from a nonempty object of entries', () => {
            expect(() => {
                const dict1 = new Dictionary({
                    foo: 42,
                    bar: 'hello',
                });
            }).to.not.throw();
        });
        
        it('should construct a Dictionary from a nonempty Map of type Map<string, A>', () => {
            expect(() => {
                const dict1 = new Dictionary(new Map([
                    ['foo', 42],
                    ['bar', 'hello'],
                ]));
            }).to.not.throw();
        });
    });
    
    describe('hash()', () => {
        // Note: hashes are not guaranteed to be stable, so the hardcoded hashes below
        // may fail at some point (which is fine).
        
        it('should return the hash', () => {
            const dict1 = new Dictionary({
                foo: 42,
                bar: 'hello',
            });
            
            expect(dict1.hash()).to.equal('d365b587b3d8f7a9c6872a03b81a493d81d66554');
        });
    });
    
    describe('equals()', () => {
        it('should return false if the given dictionary does not have the same size', () => {
            const dict1 = new Dictionary({
                foo: 42,
                bar: 'hello',
                baz: 44,
            });
            
            const dict2 = new Dictionary({
                foo: 42,
                baz: 43,
            });
            
            expect(dict1).to.not.satisfy(subject => subject.equals(dict2));
        });
        
        it('should return false if the given dictionary does not have equal keys', () => {
            const dict1 = new Dictionary({
                foo: 42,
                bar: 'hello',
            });
            
            const dict2 = new Dictionary({
                foo: 42,
                baz: 43,
            });
            
            expect(dict1).to.not.satisfy(subject => subject.equals(dict2));
        });
        
        it('should return false if the given dictionary does not have equal values', () => {
            const dict1 = new Dictionary({
                foo: 42,
                bar: 'hello',
            });
            
            const dict2 = new Dictionary({
                foo: 42,
                bar: 44,
            });
            
            expect(dict1).to.not.satisfy(subject => subject.equals(dict2));
        });
        
        it('should return true if the given dictionary has equal entries', () => {
            const dict1 = new Dictionary({
                foo: 42,
                bar: 'hello',
            });
            
            const dict2 = new Dictionary({
                foo: 42,
                bar: 'hello',
            });
            
            expect(dict1).to.satisfy(subject => subject.equals(dict2));
        });
    });
    
    describe('ordering', () => {
        // Dictionary is supposed to be an ordered type. That is, the order of the entries
        // should be maintained.
        
        it('should be maintained in insertion order', () => {
            // ES6 Map is guaranteed to be ordered in order of insertion
            
            const dict1 = new Dictionary(new Map([
                ['foo', 42],
                ['bar', 43],
            ]));
            
            const dict2 = new Dictionary(new Map([
                ['bar', 43],
                ['foo', 42],
            ]));
            
            expect(dict1.hash()).to.not.equal(dict2.hash());
            expect(dict1).to.not.satisfy(subject => subject.equals(dict2));
        });
        
        it('should be maintained for plain objects as much as ES6 ordering is allowed', () => {
            // JS objects are (as of the ES6 spec) ordered, with the caveat that number-like keys
            // are ordered first. We want to maintain the order, upto the differences due to these rules.
            // See: https://stackoverflow.com/questions/5525795/does-javascript-guarantee
            
            // Update: numeric dictionary keys are not allowed at the moment anyway, so these
            // cases have been commented out.
            
            const dict1 = new Dictionary({
                //5: 41,
                foo: 42,
                bar: 'hello',
                //1: 44,
                //0: 45,
            });
            
            const dict2 = new Dictionary({
                //0: 45,
                //1: 44,
                //5: 41,
                foo: 42,
                bar: 'hello',
            });
            
            const dict3 = new Dictionary({
                //0: 45,
                //1: 44,
                //5: 41,
                bar: 'hello',
                foo: 42,
            });
            
            // `dict1` and `dict2` have the same order according to ES6 rules
            expect(dict1.hash()).to.equal(dict2.hash());
            expect(dict1).to.satisfy(subject => subject.equals(dict2));
            
            // `dict1` and `dict3` have the a different according to ES6 rules
            expect(dict1.hash()).to.not.equal(dict3.hash());
            expect(dict1).to.not.satisfy(subject => subject.equals(dict3));
        });
    });
    
    describe('toJSON()', () => {
        it('should return a JS object corresponding to the dictionary entries', () => {
            const dict1 = new Dictionary({
                foo: 42,
                bar: 'hello',
            });
            
            expect(dict1.toJSON()).to.deep.equal({
                foo: 42,
                bar: 'hello',
            });
        });
    });
    
    describe('size()', () => {
        it('should return the size of the dictionary', () => {
            const dict1 = new Dictionary({
                foo: 42,
            });
            const dict2 = new Dictionary({
                foo: 42,
                bar: 'hello',
                baz: 44,
                qux: 45,
                quux: 46,
            });
            
            expect(dict1.size()).to.equal(1);
            expect(dict2.size()).to.equal(5);
        });
        
        it('should return the entry value for an existing key', () => {
            const dict1 = new Dictionary({
                foo: 42,
                bar: 'hello',
            });
            
            expect(dict1.get('foo')).to.equal(42);
        });
    });
    
    describe('has()', () => {
        it('should return false for a nonexisting key', () => {
            const dict1 = new Dictionary({
                foo: 42,
                bar: 'hello',
            });
            
            expect(dict1.has('nonexistent')).to.be.false;
        });
        
        it('should return true for an existing key', () => {
            const dict1 = new Dictionary({
                foo: 42,
                bar: 'hello',
            });
            
            expect(dict1.has('foo')).to.be.true;
        });
    });
    
    describe('get()', () => {
        it('should fail for a nonexisting key', () => {
            const dict1 = new Dictionary({
                foo: 42,
                bar: 'hello',
            });
            
            expect(() => {
                dict1.get('nonexistent');
            }).to.throw(TypeError);
        });
        
        it('should return the entry value for an existing key', () => {
            const dict1 = new Dictionary({
                foo: 42,
                bar: 'hello',
            });
            
            expect(dict1.get('foo')).to.equal(42);
        });
    });
    
    describe('map()', () => {
        it('should return a new dictionary with the function mapped over the entries', () => {
            const dict1 = new Dictionary({
                foo: 42,
                bar: 43,
            });
            
            expect(dict1.map(x => x + 1)).to.satisfy(subject => subject.equals(
                new Dictionary({
                    foo: 43,
                    bar: 44,
                })
            ));
        });
    });
});
