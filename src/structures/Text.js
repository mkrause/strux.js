// @flow

import env from '../util/env.js';
import hash, { asHashable } from '../util/hash.js';

import type { Hashable } from '../interfaces/Hashable.js';
import type { Equatable } from '../interfaces/Equatable.js';
import type { JsonSerializable } from '../interfaces/JsonSerializable.js';


// A nonempty textual value (any Unicode string, except the empty string "").
export default class Text implements Hashable, Equatable, JsonSerializable {
    value : string;
    
    constructor(value : string) {
        if (value === "") {
            throw new TypeError("Text value cannot be empty");
        }
        
        this.value = value;
    }
    
    // $FlowFixMe
    [asHashable]() {
        return this.value;
    }
    hash() { return hash(this.value); }
    equals(other : Hashable) { return other instanceof Text && this.value === other.value; }
    
    toString() { return this.value; }
    // $FlowFixMe
    [Symbol.toPrimitive]() { return this.value; }
    toJSON() { return this.value; }
}
