// @flow
declare var describe: any;
declare var it: any;

import chai, { assert, expect } from 'chai';

import Natural from '../../src/structures/NaturalNonempty.js';


describe('NaturalNonempty', () => {
    describe('constructor', () => {
        it('should fail on empty arguments', () => {
           // Statically checked
           try {
               // $FlowFixMe
               const nat = new Natural();
           } catch (e) {}
        });
        
        it('should fail when given a non-integer number', () => {
            expect(() => {
                const nat = new Natural(10.5);
            }).to.throw(TypeError);
        });
        
        it('should fail when given Infinity', () => {
            expect(() => {
                const nat = new Natural(Infinity);
            }).to.throw(TypeError);
        });
        
        it('should fail when given -Infinity', () => {
            expect(() => {
                const nat = new Natural(Infinity);
            }).to.throw(TypeError);
        });
        
        it('should fail when given +0', () => {
            expect(() => {
                const nat = new Natural(+0);
            }).to.throw(TypeError);
        });
        
        it('should fail when given -0', () => {
            expect(() => {
                const nat = new Natural(-0);
            }).to.throw(TypeError);
        });
        
        it('should fail when given a negative number', () => {
            expect(() => {
                const nat = new Natural(-1);
            }).to.throw(TypeError);
        });
        
        it('should construct a Natural instance from a natural JS number', () => {
            expect(() => {
                const nat = new Natural(42);
            }).to.not.throw(TypeError);
        });
    });
    
    describe('hash()', () => {
        // Note: hashes are not guaranteed to be stable, so the hardcoded hashes below
        // may fail at some point (which is fine).
        
        it('should return the hash', () => {
            const nat = new Natural(42);
            
            expect(nat.hash()).to.equal('74a925d86506a09f8d6e02660669ff2a35136140');
        });
    });
    
    describe('equals()', () => {
        it('should not equal a Natural instance with a different value', () => {
            const nat1 = new Natural(42);
            const nat2 = new Natural(43);
            
            expect(nat1).to.not.satisfy(subject => subject.equals(nat2));
        });
        
        it('should equal a Natural instance with an equal value', () => {
            const nat1 = new Natural(42);
            const nat2 = new Natural(42);
            
            expect(nat1).to.satisfy(subject => subject.equals(nat2));
        });
    });
    
    describe('toJSON()', () => {
        it('should return the corresponding JS number', () => {
            const nat = new Natural(42);
            
            expect(nat.toJSON()).to.equal(42);
            expect(JSON.stringify(nat)).to.equal('42');
        });
    });
});
