// @flow
declare var describe: any;
declare var it: any;

import chai, { assert, expect } from 'chai';

import Record from '../../src/structures/Record.js';


type Person = { name : string, score : number };

describe('Record', () => {
    describe('constructor', () => {
        it('should fail on empty arguments', () => {
            expect(() => {
                // $ExpectError
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
                const record1 : Record<Person> = new Record({
                    name: 'John',
                    score: 42,
                });
            }).to.not.throw();
        });
    });
    
    describe('hash()', () => {
        // Note: hashes are not guaranteed to be stable, so the hardcoded hashes below
        // may fail at some point (which is fine).
        
        it('should return the hash', () => {
            const record1 : Record<Person> = new Record({
                name: 'John',
                score: 42,
            });
            
            expect(record1.hash()).to.equal('7e45df4cb6817c5e5ec1ad4ca7fca703fd7fa6b2');
        });
    });
    
    describe('equals()', () => {
        it('should return false if the given record does not have the same size', () => {
            const record1 : Record<Person & { foo: number }> = new Record({
                name: 'John',
                score: 42,
                foo: 44,
            });
            
            const record2 : Record<Person> = new Record({
                name: 'John',
                score: 42,
            });
            
            expect(record1).to.not.satisfy(subject => subject.equals(record2));
        });
        
        it('should return false if the given record does not have equal keys', () => {
            const record1 : Record<Person> = new Record({
                name: 'John',
                score: 42,
            });
            
            const record2 : Record<{ name : string, foo : number }> = new Record({
                name: 'John',
                foo: 42,
            });
            
            expect(record1).to.not.satisfy(subject => subject.equals(record2));
        });
        
        it('should return false if the given record does not have equal values', () => {
            const record1 : Record<Person> = new Record({
                name: 'John',
                score: 42,
            });
            
            const record2 : Record<Person> = new Record({
                name: 'John',
                score: 43,
            });
            
            expect(record1).to.not.satisfy(subject => subject.equals(record2));
        });
        
        it('should return true if the given record has equal properties', () => {
            const record1 : Record<Person> = new Record({
                name: 'John',
                score: 42,
            });
            
            const record2 : Record<Person> = new Record({
                name: 'John',
                score: 42,
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
                foo: 'hello',
                bar: 42,
                //1: 44,
                //0: 45,
            });
            
            const record2 = new Record({
                //0: 45,
                //1: 44,
                //5: 41,
                foo: 'hello',
                bar: 42,
            });
            
            const record3 = new Record({
                //0: 45,
                //1: 44,
                //5: 41,
                bar: 42,
                foo: 'hello',
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
            const record1 : Record<Person> = new Record({
                name: 'John',
                score: 42,
            });
            
            expect(record1.toJSON()).to.deep.equal({
                name: 'John',
                score: 42,
            });
        });
    });
    
    describe('size()', () => {
        it('should return the size of the record', () => {
            const record1 = new Record({
                foo: 'John',
            });
            const record2 = new Record({
                foo: 'John',
                bar: 42,
                baz: 44,
                qux: 45,
                quux: 46,
            });
            
            expect(record1.size()).to.equal(1);
            expect(record2.size()).to.equal(5);
        });
        
        it('should return the property value for an existing key', () => {
            const record1 : Record<Person> = new Record({
                name: 'John',
                score: 42,
            });
            
            expect(record1.get('name')).to.equal('John');
        });
    });
    
    describe('has()', () => {
        it('should return false for a nonexisting key', () => {
            const record1 : Record<Person> = new Record({
                name: 'John',
                score: 42,
            });
            
            // $ExpectError
            expect(record1.has('nonexistent')).to.be.false;
        });
        
        it('should return true for an existing key', () => {
            const record1 : Record<Person> = new Record({
                name: 'John',
                score: 42,
            });
            
            expect(record1.has('name')).to.be.true;
        });
    });
    
    describe('get()', () => {
        it('should fail for a nonexisting key', () => {
            const record1 : Record<Person> = new Record({
                name: 'John',
                score: 42,
            });
            
            expect(() => {
                // $ExpectError
                record1.get('nonexistent');
            }).to.throw(TypeError);
        });
        
        it('should return the property value for an existing key', () => {
            const record1 : Record<Person> = new Record({
                name: 'John',
                score: 42,
            });
            
            expect(record1.get('name')).to.equal('John');
        });
    });
    
    // describe('getters', () => {
    //     it('should allow direct property access to nonconflicting property names', () => {
    //         const record1 : Record<Person> = new Record({
    //             name: 'John',
    //             score: 42,
    //         });
            
    //         expect(record1.name).to.equal('John');
    //     });
    // });
    
    describe('set()', () => {
        it('should fail for a nonexisting key', () => {
            const record1 : Record<Person> = new Record({
                name: 'John',
                score: 42,
            });
            
            expect(() => {
                // $ExpectError
                record1.set('nonexistent', 43);
            }).to.throw(TypeError);
        });
        
        it('should return a record with the updated property for an existing key', () => {
            const record1 : Record<Person> = new Record({
                name: 'John',
                score: 42,
            });
            
            expect(record1.set('score', 43)).to.satisfy(subject => subject.equals(
                new Record({
                    name: 'John',
                    score: 43,
                })
            ));
        });
    });
});
