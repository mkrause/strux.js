// @flow
declare var describe: any;
declare var it: any;

import chai, { assert, expect } from 'chai';

import Mapping from '../../src/structures/Mapping.js';


describe('Mapping', () => {
    describe('constructor', () => {
        it('should fail on empty arguments', () => {
            expect(() => {
                // $FlowFixMe
                const mapping1 = new Mapping();
            }).to.throw(TypeError);
        });
        
        it('should not allow the construction of an empty Mapping', () => {
            expect(() => {
                const mapping1 = new Mapping({});
            }).to.throw(TypeError);
            
            expect(() => {
                const mapping1 = new Mapping(new Map());
            }).to.throw(TypeError);
        });
        
        it('should construct a Mapping from a nonempty Map', () => {
            expect(() => {
                const mapping1 = new Mapping(new Map([
                    ['foo', 42],
                    [100, 'hello'],
                ]));
            }).to.not.throw();
        });
        
        it('should construct a Mapping from a nonempty array of [key, value] pairs', () => {
            expect(() => {
                const mapping1 = new Mapping([
                    ['foo', 42],
                    [100, 'hello'],
                ]);
            }).to.not.throw();
        });
        
        it('should construct a Mapping from a nonempty object of entries', () => {
            expect(() => {
                const mapping1 = new Mapping({
                    foo: 42,
                    bar: 'hello',
                });
            }).to.not.throw();
        });
    });
    
    describe('hash()', () => {
        // Note: hashes are not guaranteed to be stable, so the hardcoded hashes below
        // may fail at some point (which is fine).
        
        it('should return the hash', () => {
            const mapping1 = new Mapping({
                foo: 42,
                bar: 'hello',
            });
            
            expect(mapping1.hash()).to.equal('265e3c7904579da9238d433b6ea5d94d9df193fe');
        });
    });
    
    describe('equals()', () => {
        it('should return false if the given mapping does not have the same size', () => {
            const mapping1 = new Mapping({
                foo: 42,
                bar: 'hello',
                baz: 44,
            });
            
            const mapping2 = new Mapping({
                foo: 42,
                baz: 43,
            });
            
            expect(mapping1).to.not.satisfy(subject => subject.equals(mapping2));
        });
        
        it('should return false if the given mapping does not have equal keys', () => {
            const mapping1 = new Mapping({
                foo: 42,
                bar: 'hello',
            });
            
            const mapping2 = new Mapping({
                foo: 42,
                baz: 43,
            });
            
            expect(mapping1).to.not.satisfy(subject => subject.equals(mapping2));
        });
        
        it('should return false if the given mapping does not have equal values', () => {
            const mapping1 = new Mapping({
                foo: 42,
                bar: 'hello',
            });
            
            const mapping2 = new Mapping({
                foo: 42,
                bar: 44,
            });
            
            expect(mapping1).to.not.satisfy(subject => subject.equals(mapping2));
        });
        
        it('should return true if the given mapping has equal entries', () => {
            const mapping1 = new Mapping({
                foo: 42,
                bar: 'hello',
            });
            
            const mapping2 = new Mapping({
                foo: 42,
                bar: 'hello',
            });
            
            expect(mapping1).to.satisfy(subject => subject.equals(mapping2));
        });
    });
    
    describe('ordering', () => {
        // Mapping is supposed to be an ordered type. That is, the order of the entries
        // should be maintained.
        
        it('should be maintained in insertion order', () => {
            // ES6 Map is guaranteed to be ordered in order of insertion
            
            const mapping1 = new Mapping(new Map([
                ['foo', 42],
                ['bar', 43],
            ]));
            
            const mapping2 = new Mapping(new Map([
                ['bar', 43],
                ['foo', 42],
            ]));
            
            expect(mapping1.hash()).to.not.equal(mapping2.hash());
            expect(mapping1).to.not.satisfy(subject => subject.equals(mapping2));
        });
        
        it('should be maintained for plain objects as much as ES6 ordering is allowed', () => {
            // JS objects are (as of the ES6 spec) ordered, with the caveat that number-like keys
            // are ordered first. We want to maintain the order, upto the differences due to these rules.
            // See: https://stackoverflow.com/questions/5525795/does-javascript-guarantee
            
            // Update: numeric mapping keys are not allowed at the moment anyway, so these
            // cases have been commented out.
            
            const mapping1 = new Mapping({
                //5: 41,
                foo: 42,
                bar: 'hello',
                //1: 44,
                //0: 45,
            });
            
            const mapping2 = new Mapping({
                //0: 45,
                //1: 44,
                //5: 41,
                foo: 42,
                bar: 'hello',
            });
            
            const mapping3 = new Mapping({
                //0: 45,
                //1: 44,
                //5: 41,
                bar: 'hello',
                foo: 42,
            });
            
            // `mapping1` and `mapping2` have the same order according to ES6 rules
            expect(mapping1.hash()).to.equal(mapping2.hash());
            expect(mapping1).to.satisfy(subject => subject.equals(mapping2));
            
            // `mapping1` and `mapping3` have the a different according to ES6 rules
            expect(mapping1.hash()).to.not.equal(mapping3.hash());
            expect(mapping1).to.not.satisfy(subject => subject.equals(mapping3));
        });
    });
    
    describe('toJSON()', () => {
        it('should return a JS array corresponding to the mapping entries (from Map)', () => {
            const mapping1 = new Mapping(new Map([
                ['foo', 42],
                ['bar', 'hello'],
            ]));
            
            expect(mapping1.toJSON()).to.deep.equal([
                ['foo', 42],
                ['bar', 'hello'],
            ]);
        });
        
        it('should return a JS array corresponding to the mapping entries (from array)', () => {
            const mapping1 = new Mapping([
                ['foo', 42],
                ['bar', 'hello'],
            ]);
            
            expect(mapping1.toJSON()).to.deep.equal([
                ['foo', 42],
                ['bar', 'hello'],
            ]);
        });
        
        it('should return a JS array corresponding to the mapping entries (from object)', () => {
            const mapping1 = new Mapping({
                foo: 42,
                bar: 'hello',
            });
            
            expect(mapping1.toJSON()).to.deep.equal([
                ['foo', 42],
                ['bar', 'hello'],
            ]);
        });
    });
    
    describe('size()', () => {
        it('should return the size of the mapping', () => {
            const mapping1 = new Mapping({
                foo: 42,
            });
            const mapping2 = new Mapping({
                foo: 42,
                bar: 'hello',
                baz: 44,
                qux: 45,
                quux: 46,
            });
            
            expect(mapping1.size()).to.equal(1);
            expect(mapping2.size()).to.equal(5);
        });
        
        it('should return the entry value for an existing key', () => {
            const mapping1 = new Mapping({
                foo: 42,
                bar: 'hello',
            });
            
            expect(mapping1.get('foo')).to.equal(42);
        });
    });
    
    describe('has()', () => {
        it('should return false for a nonexisting key', () => {
            const mapping1 = new Mapping({
                foo: 42,
                bar: 'hello',
            });
            
            expect(mapping1.has('nonexistent')).to.be.false;
        });
        
        it('should return true for an existing key', () => {
            const mapping1 = new Mapping({
                foo: 42,
                bar: 'hello',
            });
            
            expect(mapping1.has('foo')).to.be.true;
        });
    });
    
    describe('get()', () => {
        it('should fail for a nonexisting key', () => {
            const mapping1 = new Mapping({
                foo: 42,
                bar: 'hello',
            });
            
            expect(() => {
                mapping1.get('nonexistent');
            }).to.throw(TypeError);
        });
        
        it('should return the entry value for an existing key', () => {
            const mapping1 = new Mapping({
                foo: 42,
                bar: 'hello',
            });
            
            expect(mapping1.get('foo')).to.equal(42);
        });
        
        it('should compare keys by value equality', () => {
            const mapping1 = new Mapping([
                [{ id: 'john' }, 42],
                [{ id: 'alice' }, 101],
            ]);
            
            expect(mapping1.get({ id: 'john' })).to.equal(42);
        });
    });
    
    describe('map()', () => {
        it('should return a new mapping with the function mapped over the entries', () => {
            const mapping1 = new Mapping({
                foo: 42,
                bar: 43,
            });
            
            expect(mapping1.map(x => x + 1)).to.satisfy(subject => subject.equals(
                new Mapping({
                    foo: 43,
                    bar: 44,
                })
            ));
        });
    });
});
