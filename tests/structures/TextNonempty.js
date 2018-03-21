// @flow
declare var describe: any;
declare var it: any;

import chai, { assert, expect } from 'chai';

import Text from '../../src/structures/TextNonempty.js';


describe('TextNonempty', () => {
    describe('constructor', () => {
        it('should fail on empty arguments', () => {
            // Statically checked
            // $FlowFixMe
            const text = new Text();
        });
        
        it('should fail when given an empty string', () => {
            expect(() => {
                const text = new Text("");
            }).to.throw(TypeError);
        });
        
        it('should construct a Text instance from a nonempty JS string', () => {
            expect(() => {
                const text = new Text('foo');
            }).to.not.throw(TypeError);
        });
    });
    
    describe('hash()', () => {
        // Note: hashes are not guaranteed to be stable, so the hardcoded hashes below
        // may fail at some point (which is fine).
        
        it('should return the hash', () => {
            const text = new Text('foo');
            
            expect(text.hash()).to.equal('7cd3edacc4c9dd43908177508c112608a398bb9a');
        });
    });
    
    describe('equals()', () => {
        it('should not equal a Text instance with a different value', () => {
            const text1 = new Text('foo');
            const text2 = new Text('bar');
            
            expect(text1).to.not.satisfy(subject => subject.equals(text2));
        });
        
        it('should equal a Text instance with an equal value', () => {
            const text1 = new Text('foo');
            const text2 = new Text('foo');
            
            expect(text1).to.satisfy(subject => subject.equals(text2));
        });
    });
    
    describe('toJSON()', () => {
        it('should return the corresponding JS string', () => {
            const text = new Text('foo');
            
            expect(text.toJSON()).to.equal('foo');
            expect(JSON.stringify(text)).to.equal('"foo"');
        });
    });
});
