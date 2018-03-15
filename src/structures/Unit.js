// @flow

import env from '../util/env.js';
import hash, { asHashable } from '../util/hash.js';

import type { Hashable } from '../interfaces/Hashable.js';
import type { Equatable } from '../interfaces/Equatable.js';
import type { JsonSerializable } from '../interfaces/JsonSerializable.js';


// Cache an instance of the empty object, so that hash() never has to calculate the hash twice
const empty = {};

// The empty value
export default class Unit implements Hashable, Equatable, JsonSerializable {
    constructor() {}
    
    // $FlowFixMe
    [asHashable]() {
        return null;
    }
    hash() {
        return hash(empty);
    }
    equals(other : Hashable) {
        return other instanceof Unit;
    }
    toJSON() {
        return null;
    }
}
