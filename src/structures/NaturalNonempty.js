// @flow

import env from '../util/env.js';
import hash, { asHashable } from '../util/hash.js';

import type { Hash, Hashable } from '../interfaces/Hashable.js';
import type { Equatable } from '../interfaces/Equatable.js';
import type { JsonSerializable } from '../interfaces/JsonSerializable.js';


// A natural number (any integer greater than zero)
export default class Natural implements Hashable, Equatable, JsonSerializable {
    value : number;
    
    constructor(value : number) {
        if (!isFinite(value)) {
            throw new TypeError(`Natural cannot be infinity or NaN, given '${value}'`);
        }
        
        if (!Number.isInteger(value)) {
            throw new TypeError(`Natural must be an integer, given '${value}'`);
        }
        
        if (value < 0) {
            throw new TypeError(`Natural must be positive, given '${value}'`);
        }
        
        if (value === 0) {
            throw new TypeError(`Natural cannot be zero, given '${value}'`);
        }
        
        this.value = value;
    }
    
    // $FlowFixMe
    [asHashable]() {
        return this.value;
    }
    hash() : Hash { return hash(this.value); }
    equals(other : mixed) { return other instanceof Natural && this.value === other.value; }
    
    valueOf() { return this.value; }
    // $FlowFixMe
    [Symbol.toPrimitive]() { return this.value; }
    toJSON() { return this.value; }
}
