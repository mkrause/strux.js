// @flow

import env from '../util/env.js';
import hash, { asHashable } from '../util/hash.js';
import MapUtil from '../util/map_util.js';
import ObjectUtil from '../util/object_util.js';
import { isValidSymbol } from '../util/symbol.js';

import type { Hash, Hashable } from '../interfaces/Hashable.js';
import type { Equatable } from '../interfaces/Equatable.js';
import type { JsonSerializable } from '../interfaces/JsonSerializable.js';


type KeyT = any;
type EntryT = any;

// A nonempty set of key-value pairs, of type `K` and `A` respectively.
export default class Mapping<K : KeyT, A : EntryT> implements Hashable, Equatable, JsonSerializable {
    _entries : Map<Hash, [K, A]>;
    
    constructor(entries : Iterable<[K, A]> | { [string] : A }) {
        // $FlowFixMe: computed property
        if (typeof entries[Symbol.iterator] === 'function') {
            this._entries = new Map(function*() {
                for (const [key, value] of entries) {
                    yield [hash(key), [key, value]];
                }
            }());
        } else {
            this._entries = new Map(function*() : Iterator<[Hash, [K, A]]> {
                // Type cast: assure flow that `K` = string
                const objectEntries : Array<[K, A]> = (ObjectUtil.entries(entries) : any);
                for (const [key, value] of objectEntries) {
                    yield [hash(key), [key, value]];
                }
            }());
        }
    }
    
    // $FlowFixMe: computed property key
    [asHashable]() {
        // Note: return another Map object (rather than a plain object), so that ordering is maintained
        return MapUtil.map(this._entries, ([key, entry], keyHash) => [keyHash, hash(entry)]);
    }
    hash() : Hash { return hash(this); }
    equals(other : mixed) {
        return other instanceof Mapping && hash(this) === hash(other);
    }
    toJSON() : Array<[K, A]> {
        return [...this._entries.values()]
            .map(([key, entry]) => {
                const keyAsJson = typeof key === 'object' && key && key.toJSON ? key.toJSON() : key;
                const entryAsJson = typeof entry === 'object' && entry && entry.toJSON ? entry.toJSON() : entry;
                return [keyAsJson, entryAsJson];
            });
    }
    
    size() {
        return this._entries.size;
    }
    
    // Note: have to use comment syntax for @@iterator, because the babel flow transform doesn't understand it
    /*:: @@iterator() : Iterator<[K, A]> { return (this : any); }*/
    // $FlowFixMe: computed property key
    *[Symbol.iterator]() : Iterator<[K, A]> {
        for (const [keyHash, [key, value]] of this._entries) {
            yield [key, value];
        }
    }
    entriesAsArray() : Array<[K, A]> { return [...this]; }
    
    has(key : K) : boolean {
        return this._entries.has(hash(key));
    }
    get(key : K) : A {
        const keyHash = hash(key);
        if (!this._entries.has(keyHash)) {
            throw new TypeError(`No such entry '${JSON.stringify(key)}'`);
        }
        
        const [_, value] : [K, A] = (this._entries.get(keyHash) : any); // Assure flow that the entry exists
        return value;
    }
    
    map<B : EntryT>(fn : (A, ?K) => B) : Mapping<K, B> {
        const entries = this._entries;
        return new Mapping(function*() : Iterator<[K, B]> {
            for (const [_, [key, value]] of entries) {
                yield [key, fn(value)];
            }
        }());
    }
    mapToArray<B>(fn : (A, ?K) => B) : Array<B> {
        return this.entriesAsArray().map(([key, value]) => fn(value, key));
    }
    mapToString<B>(separator : string, fn : (A, ?K) => B) : string {
        return this.mapToArray(fn).join(separator);
    }
    // mapToObject(fn : *) { return TODO; }
    
    set(key : K, value : A) : Mapping<K, A> {
        const keyHash = hash(key);
        if (!this._entries.has(keyHash)) {
            throw new TypeError(`No such entry '${JSON.stringify(key)}'`);
        }
        
        const entries = this._entries;
        return new Mapping(function*() : Iterator<[K, A]> {
            for (const [curKeyHash, entry] of entries) {
                if (curKeyHash === keyHash) {
                    yield [key, value];
                } else {
                    yield entry;
                }
            }
        }());
    }
}
