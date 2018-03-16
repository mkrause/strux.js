// @flow

import env from '../util/env.js';
import hash, { asHashable } from '../util/hash.js';
import MapUtil from '../util/map_util.js';
import { isValidSymbol } from '../util/symbol.js';

import type { Hashable } from '../interfaces/Hashable.js';
import type { Equatable } from '../interfaces/Equatable.js';
import type { JsonSerializable } from '../interfaces/JsonSerializable.js';


type Hash = string;
type KeyT = any;
type EntryT = any;

// A nonempty set of key-value pairs, of type `K` and `A` respectively.
export default class Mapping<K : KeyT, A : EntryT> implements Hashable, Equatable, JsonSerializable {
    entries : Map<Hash, [K, A]>;
    
    constructor(entries : Map<K, A> | Array<[K, A]> | { +[string] : A }) {
        if (entries instanceof Map) {
            if (entries.size === 0) {
                throw new TypeError(`Mapping cannot be empty. Given an empty Map.`);
            }
            
            this.entries = new Map(function*() {
                for (const [key, value] of entries) {
                    yield [hash(key), [key, value]];
                }
            }());
        } else if (Array.isArray(entries)) {
            if (entries.length === 0) {
                throw new TypeError(`Mapping cannot be empty. Given an empty array.`);
            }
            
            this.entries = new Map(function*() {
                for (const [key, value] of entries) {
                    yield [hash(key), [key, value]];
                }
            }());
        } else {
            if (Object.keys(entries).length === 0) {
                throw new TypeError(`Mapping cannot be empty. Given an empty object.`);
            }
            
            this.entries = new Map(function*() {
                // Type cast: assure flow that `K` = `string` in this case
                const objectEntries : { [string] : A } = (Object.entries(entries) : any);
                for (const [key, value] of objectEntries) {
                    yield [hash(key), [key, value]];
                }
            }());
        }
    }
    
    // $FlowFixMe
    [asHashable]() {
        // Note: return another Map object (rather than a plain object), so that ordering is maintained
        return MapUtil.map(this.entries, ([key, entry], keyHash) => [keyHash, hash(entry)]);
    }
    hash() { return hash(this); }
    equals(other : Hashable) {
        return other instanceof Mapping && hash(this) === hash(other);
    }
    toJSON() : Array<[K, A]> {
        return [...this.entries.values()]
            .map(([key, entry]) => {
                const keyAsJson = typeof key === 'object' && key && key.toJSON ? key.toJSON() : key;
                const entryAsJson = typeof entry === 'object' && entry && entry.toJSON ? entry.toJSON() : entry;
                return [keyAsJson, entryAsJson];
            });
    }
    
    size() {
        return this.entries.size;
    }
    
    has(key : K) : boolean {
        return this.entries.has(hash(key));
    }
    get(key : K) : A {
        const keyHash = hash(key);
        if (!this.entries.has(keyHash)) {
            throw new TypeError(`No such entry '${JSON.stringify(key)}'`);
        }
        
        const entry : A = (this.entries.get(keyHash) : any); // Assure flow that the entry exists
        return entry[1];
    }
    
    map<B : EntryT>(fn : (A, ?K) => B) : Mapping<K, B> {
        return new Mapping(
            [...this.entries.values()].map(([key, value]) => [key, fn(value)])
        );
    }
    // mapToArray(fn : *) { return MapUtil.values(this.map(fn).entries); }
    // mapToObject(fn : *) { return this.map(fn).entries; }
    // mapToString(separator : string, fn : *) { return this.mapToArray(fn).join(separator); }
}
