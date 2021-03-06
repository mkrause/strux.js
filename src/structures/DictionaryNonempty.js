// @flow

import env from '../util/env.js';
import hash, { asHashable } from '../util/hash.js';
import MapUtil from '../util/map_util.js';
import { isValidSymbol } from '../util/symbol.js';

import type { Hash, Hashable } from '../interfaces/Hashable.js';
import type { Equatable } from '../interfaces/Equatable.js';
import type { JsonSerializable } from '../interfaces/JsonSerializable.js';


type EntryT = void | null | boolean | string | number | (Hashable & Equatable & JsonSerializable);

// A nonempty set of key-value pairs, where keys are symbols and values are of a fixed type `A`.
export default class Dictionary<A : EntryT> implements Hashable, Equatable, JsonSerializable {
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
    
    // $FlowFixMe
    [asHashable]() {
        // Note: return another Map object (rather than a plain object), so that ordering is maintained
        return MapUtil.map(this.entries, hash);
    }
    hash() : Hash { return hash(this); }
    equals(other : mixed) : boolean {
        return other instanceof Dictionary && hash(this) === hash(other);
    }
    toJSON() : { [string] : A } {
        // Note: returns an object, which influences the ordering of the entries. A particular order is still
        // somewhat guaranteed (as of the ES6 spec), but it may not be the same as our original ordering.
        // See: https://stackoverflow.com/questions/5525795/does-javascript-guarantee-object-property-order
        return [...this.entries.entries()]
            .reduce((acc, [entryName, entry] : [string, A]) => {
                if (typeof entry === 'object' && entry && entry.toJSON) {
                    return { ...acc, [entryName]: entry.toJSON() };
                } else {
                    return { ...acc, [entryName]: entry };
                }
            }, {});
    }
    
    size() : number {
        return this.entries.size;
    }
    
    has(entryName : string) : boolean {
        return this.entries.has(entryName);
    }
    get(entryName : string) : ?A {
        if (!this.entries.has(entryName)) {
            throw new TypeError(`No such entry '${entryName}'`);
        }
        
        return this.entries.get(entryName);
    }
    
    map<B : EntryT>(fn : (A, ?string) => B) : Dictionary<B> {
        return new Dictionary(MapUtil.map(this.entries, fn));
    }
    // mapToArray(fn : *) { return MapUtil.values(this.map(fn).entries); }
    // mapToObject(fn : *) { return this.map(fn).entries; }
    // mapToString(separator : string, fn : *) { return this.mapToArray(fn).join(separator); }
}
