// @flow

import env from '../util/env.js';
import hash, { asHashable } from '../util/hash.js';
import ObjectUtil from '../util/object_util.js';
import { isValidSymbol } from '../util/symbol.js';

import type { Hashable } from '../interfaces/Hashable.js';
import type { Equatable } from '../interfaces/Equatable.js';
import type { JsonSerializable } from '../interfaces/JsonSerializable.js';


// A nonempty set of key-value pairs, where keys are symbols and values are of a fixed type `T`.
export default class Dictionary<T : Hashable & Equatable & JsonSerializable> implements Hashable, Equatable, JsonSerializable {
    entries : { [string] : T };
    
    constructor(entries : *) {
        if (Object.keys(entries).length === 0) {
            throw new TypeError(`Dictionary cannot be empty`);
        }
        
        if (env.debug) {
            Object.keys(entries).forEach(entryName => {
                if (!isValidSymbol(entryName)) {
                    throw new TypeError(`Invalid symbol: '${entryName}'`);
                }
            });
        }
        
        Object.assign(this, { entries });
    }
    
    [asHashable]() {
        return ObjectUtil.map(this.entries, hash);
    }
    hash() { return hash(this); }
    equals(other : Hashable) {
        return other instanceof Dictionary && hash(this) === hash(other);
    }
    toJSON() {
        return ObjectUtil.map(this.entries, prop => {
            if (prop && prop.toJSON) {
                return prop.toJSON();
            } else {
                return prop;
            }
        });
    }
    
    size() {
        return Object.keys(this.entries).length;
    }
    
    has(entryName : string) {
        return this.entries.hasOwnProperty(entryName);
    }
    get(entryName : string) {
        if (!this.entries.hasOwnProperty(entryName)) {
            throw new TypeError(`No such entry '${entryName}'`);
        }
        
        return this.entries[entryName];
    }
    
    map(fn : (T, ?string) => T) : Dictionary<T> {
        return new Dictionary(ObjectUtil.map(this.entries, fn));
    }
    mapToArray(fn : *) { return ObjectUtil.values(this.map(fn).entries); }
    mapToObject(fn : *) { return this.map(fn).entries; }
    mapToString(separator : string, fn : *) { return this.mapToArray(fn).join(separator); }
}
