// @flow
declare var describe: any;
declare var it: any;

import chai, { assert, expect } from 'chai';

import Unit from '../../src/structures/Unit.js';


describe('Unit', () => {
    describe('constructor', () => {
        it('should construct a Unit', () => {
            expect(() => {
                const unit = new Unit();
            }).to.not.throw(TypeError);
        });
    });
    
    describe('hash()', () => {
        // Note: hashes are not guaranteed to be stable, so the hardcoded hashes below
        // may fail at some point (which is fine).
        
        it('should return the hash', () => {
            const unit = new Unit();
            
            expect(unit.hash()).to.equal('535c3001aaae9307daae192e1467b64126937576');
        });
    });
    
    describe('equals()', () => {
        it('should equal any Unit', () => {
            const unit1 = new Unit();
            const unit2 = new Unit();
            
            expect(unit1).to.satisfy(subject => subject.equals(unit2));
        });
    });
    
    describe('toJSON()', () => {
        it('should return null', () => {
            const unit = new Unit();
            
            expect(unit.toJSON()).to.deep.equal(null);
            expect(JSON.stringify(unit)).to.equal('null');
        });
    });
});
