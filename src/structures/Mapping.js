// @flow

import env from '../util/env.js';
import hash, { asHashable } from '../util/hash.js';
import MapUtil from '../util/map_util.js';
import { isValidSymbol } from '../util/symbol.js';

import type { Hashable } from '../interfaces/Hashable.js';
import type { Equatable } from '../interfaces/Equatable.js';
import type { JsonSerializable } from '../interfaces/JsonSerializable.js';


type KeyT = number | string | (Hashable & Equatable & JsonSerializable);
type EntryT = number | string | (Hashable & Equatable & JsonSerializable);

// A nonempty set of key-value pairs, where keys are symbols and values are of a fixed type `A`.
export default class Mapping<K : KeyT, A : EntryT> implements Hashable, Equatable, JsonSerializable {
    entries : Map<K, A>;
    
    constructor(entries : Map<K, A> | { +[string] : A }) {
        if (entries instanceof Map) {
            if (entries.size === 0) {
                throw new TypeError(`Mapping cannot be empty. Given an empty Map.`);
            }
            
            this.entries = entries;
        } else {
            if (Object.keys(entries).length === 0) {
                throw new TypeError(`Mapping cannot be empty. Given an empty object.`);
            }
            
            this.entries = MapUtil.fromObject(entries);
        }
    }
    
    // $FlowFixMe
    [asHashable]() {
        // Note: return another Map object (rather than a plain object), so that ordering is maintained
        return MapUtil.map(this.entries, (entry, key) => [hash(key), hash(entry)]);
    }
    hash() { return hash(this); }
    equals(other : Hashable) {
        return other instanceof Mapping && hash(this) === hash(other);
    }
    toJSON() {
        // Note: returns an object, which influences the ordering of the entries. A particular order is still
        // somewhat guaranteed (as of the ES6 spec), but it may not be the same as our original ordering.
        // See: https://stackoverflow.com/questions/5525795/does-javascript-guarantee-object-property-order
        return [...this.entries.entries()]
            .reduce((acc, [key, entry] : [K, A]) => {
                if (typeof entry === 'object' && entry && entry.toJSON) {
                    return { ...acc, [key]: entry.toJSON() };
                } else {
                    return { ...acc, [key]: entry };
                }
            }, {});
    }
    
    size() {
        return this.entries.size;
    }
    
    has(key : K) {
        return this.entries.has(key);
    }
    get(key : K) {
        if (!this.entries.has(key)) {
            throw new TypeError(`No such entry '${key}'`);
        }
        
        return this.entries.get(key);
    }
    
    map<B : EntryT>(fn : (A, ?string) => B) : Mapping<K, B> {
        return new Mapping(MapUtil.map(this.entries, fn));
    }
    // mapToArray(fn : *) { return MapUtil.values(this.map(fn).entries); }
    // mapToObject(fn : *) { return this.map(fn).entries; }
    // mapToString(separator : string, fn : *) { return this.mapToArray(fn).join(separator); }
}
