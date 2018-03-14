// @flow

import env from '../util/env.js';
import hash, { asHashable } from '../util/hash.js';

import type { Hashable } from '../interfaces/Hashable.js';
import type { Equatable } from '../interfaces/Equatable.js';
import type { JsonSerializable } from '../interfaces/JsonSerializable.js';


// The empty value
export default class Unit<T : Hashable & Equatable & JsonSerializable> implements Hashable, Equatable, JsonSerializable {
    constructor() {}
    
    [asHashable]() {
        return null;
    }
    hash() { return hash(this); }
    equals(other : Hashable) {
        return other instanceof Unit;
    }
    toJSON() {
        return {};
    }
}
