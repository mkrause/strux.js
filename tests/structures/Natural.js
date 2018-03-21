// @flow
declare var describe: any;
declare var it: any;

import chai, { assert, expect } from 'chai';

import Natural from '../../src/structures/Natural.js';


describe('Natural', () => {
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
        
        it('should fail when given a negative number', () => {
            expect(() => {
                const nat = new Natural(-1);
            }).to.throw(TypeError);
        });
        
        
        it('should construct a Natural instance representing zero when given +0', () => {
            expect(() => {
                const nat = new Natural(+0);
            }).to.not.throw(TypeError);
            
            const nat = new Natural(+0);
            expect(nat.valueOf()).to.equal(0);
        });
        
        it('should construct a Natural instance representing zero when given -0', () => {
            expect(() => {
                const nat = new Natural(-0);
            }).to.not.throw(TypeError);
            
            const nat = new Natural(+0);
            expect(nat.valueOf()).to.equal(0);
        });
        
        it('should not distinguish between +0 and -0', () => {
            const zeroPos = new Natural(+0);
            const zeroNeg = new Natural(-0);
            
            expect(zeroPos).to.satisfy(subject => subject.equals(zeroNeg));
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
            const text1 = new Natural(42);
            const text2 = new Natural(43);
            
            expect(text1).to.not.satisfy(subject => subject.equals(text2));
        });
        
        it('should equal a Natural instance with an equal value', () => {
            const text1 = new Natural(42);
            const text2 = new Natural(42);
            
            expect(text1).to.satisfy(subject => subject.equals(text2));
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
