// @flow
declare var describe: any;
declare var it: any;

import chai, { assert, expect } from 'chai';

import Dictionary from '../../src/structures/Dictionary.js';


describe('Dictionary', () => {
    describe('constructor', () => {
        it('should fail on empty arguments', () => {
            expect(() => {
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
                    bar: 43,
                });
            }).to.not.throw();
        });
        
        it('should construct a Dictionary from a nonempty Map of type Map<string, A>', () => {
            expect(() => {
                const dict1 = new Dictionary({
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
            const dict1 = new Dictionary({
                foo: 42,
                bar: 43,
            });
            
            expect(dict1.hash()).to.equal('c5538531d62a7cc346159c3b58644b87e9d8fb45');
        });
    });
    
    describe('ordering', () => {
        // Dictionary is supposed to be an ordered type. That is, the order of the entries
        // should be maintained.
        
        it('should be maintained', () => {
            const dict1 = new Dictionary({
                foo: 42,
                bar: 43,
            });
            
            const dict2 = new Dictionary({
                bar: 43,
                foo: 42,
            });
            
            expect(dict1.hash()).to.not.equal(dict2.hash());
            expect(dict1.equals(dict2)).to.not.be.true;
        });
    });
    
    describe('toJSON()', () => {
        it('should return a JS object corresponding to the dictionary entries', () => {
            const dict1 = new Dictionary({
                foo: 42,
                bar: 43,
            });
            
            expect(dict1.toJSON()).to.deep.equal({
                foo: 42,
                bar: 43,
            });
        });
        
        it('should return the entry value for an existing key', () => {
            const dict1 = new Dictionary({
                foo: 42,
                bar: 43,
            });
            
            expect(dict1.get('foo')).to.equal(42);
        });
    });
    
    describe('size()', () => {
        it('should return the size of the dictionary', () => {
            const dict1 = new Dictionary({
                foo: 42,
            });
            const dict2 = new Dictionary({
                foo: 42,
                bar: 43,
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
                bar: 43,
            });
            
            expect(dict1.get('foo')).to.equal(42);
        });
    });
    
    describe('has()', () => {
        it('should return false for a nonexisting key', () => {
            const dict1 = new Dictionary({
                foo: 42,
                bar: 43,
            });
            
            expect(dict1.has('nonexistent')).to.be.false;
        });
        
        it('should return true for an existing key', () => {
            const dict1 = new Dictionary({
                foo: 42,
                bar: 43,
            });
            
            expect(dict1.has('foo')).to.be.true;
        });
    });
    
    describe('get()', () => {
        it('should fail for a nonexisting key', () => {
            const dict1 = new Dictionary({
                foo: 42,
                bar: 43,
            });
            
            expect(() => {
                dict1.get('nonexistent');
            }).to.throw(TypeError);
        });
        
        it('should return the entry value for an existing key', () => {
            const dict1 = new Dictionary({
                foo: 42,
                bar: 43,
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
