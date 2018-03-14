// @flow

import env from '../util/env.js';
import hash, { asHashable } from '../util/hash.js';
import MapUtil from '../util/map_util.js';
import { isValidSymbol } from '../util/symbol.js';

import type { Hashable } from '../interfaces/Hashable.js';
import type { Equatable } from '../interfaces/Equatable.js';
import type { JsonSerializable } from '../interfaces/JsonSerializable.js';


// A nonempty set of key-value pairs, where keys are symbols and values are of a fixed type `A`.
export default class Dictionary<A : Hashable & Equatable & JsonSerializable> implements Hashable, Equatable, JsonSerializable {
    entries : Map<string, A>;
    
    constructor(entries : Map<string, A> | { +[string] : A }) {
        if (entries instanceof Map) {
            if (entries.size === 0) {
                throw new TypeError(`Dictionary cannot be empty. Given an empty Map.`);
            }
            
            this.entries = entries;
        } else {
            if (Object.keys(entries).length === 0) {
                throw new TypeError(`Dictionary cannot be empty. Given an empty object.`);
            }
            
            this.entries = MapUtil.fromObject(entries);
        }
        
        if (env.debug) {
            for (const entryName of this.entries.keys()) {
                if (typeof entryName !== 'string' || !isValidSymbol(entryName)) {
                    throw new TypeError(`Invalid symbol: '${entryName}'`);
                }
            }
        }
    }
    
    [asHashable]() {
        // Note: return another Map object (rather than a plain object), so that ordering is maintained
        return MapUtil.map(this.entries, hash);
    }
    hash() { return hash(this); }
    equals(other : Hashable) {
        return other instanceof Dictionary && hash(this) === hash(other);
    }
    toJSON() {
        // Note: returns an object, which influences the ordering of the entries. A particular order is still
        // somewhat guaranteed (as of the ES6 spec), but it not be the same as our original ordering.
        // See: https://stackoverflow.com/questions/5525795/does-javascript-guarantee-object-property-order
        return [...this.entries.entries()]
            .reduce((acc, [propName, prop]) => {
                if (prop && prop.toJSON) {
                    return { ...acc, [propName]: prop.toJSON() };
                } else {
                    return { ...acc, [propName]: prop };
                }
            }, {});
    }
    
    size() {
        return this.entries.size;
    }
    
    has(entryName : string) {
        return this.entries.has(entryName);
    }
    get(entryName : string) {
        if (!this.entries.has(entryName)) {
            throw new TypeError(`No such entry '${entryName}'`);
        }
        
        return this.entries.get(entryName);
    }
    
    map<B>(fn : (A, ?string) => B) : Dictionary<B> {
        return new Dictionary(MapUtil.map(this.entries, fn));
    }
    // mapToArray(fn : *) { return MapUtil.values(this.map(fn).entries); }
    // mapToObject(fn : *) { return this.map(fn).entries; }
    // mapToString(separator : string, fn : *) { return this.mapToArray(fn).join(separator); }
}
