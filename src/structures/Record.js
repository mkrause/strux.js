// @flow

import env from '../util/env.js';
import hash, { asHashable } from '../util/hash.js';
import ObjectUtil from '../util/object_util.js';
import { isValidSymbol } from '../util/symbol.js';

import type { Hash, Hashable } from '../interfaces/Hashable.js';
import type { Equatable } from '../interfaces/Equatable.js';
import type { JsonSerializable } from '../interfaces/JsonSerializable.js';

import Dictionary from './Dictionary.js';


type K = string; // Key type
type PropertyT = void | null | boolean | string | number | (Hashable & Equatable & JsonSerializable);

// A record (set of properties), which is a valid subtype of the type `T`
export default class Record<T : { +[K] : PropertyT }> implements Hashable, Equatable, JsonSerializable {
    properties : T;
    
    constructor(properties : T) {
        if (Object.keys(properties).length === 0) {
            throw new TypeError(`Record cannot be empty`);
        }
        
        if (env.debug) {
            for (const propertyName in properties) {
                if (!isValidSymbol(propertyName)) {
                    throw new TypeError(`Invalid symbol: '${propertyName}'`);
                }
            }
        }
        
        this.properties = properties;
        
        //XXX flow doesn't accept adding dynamic properties
        // Define getters for all properties (to allow using `entity.foo` instead of `entity.get('foo')`)
        // for (const entryName of Object.keys(properties)) {
        //     if (entryName in this) {
        //         // Ignore keys that already exist
        //         continue;
        //     }
        //     
        //     Object.defineProperty(this, entryName, {
        //         get: () => this.properties[entryName],
        //     });
        // }
    }
    
    // $FlowFixMe: computed property
    [asHashable]() {
        return ObjectUtil.map(this.properties, hash);
    }
    hash() : Hash { return hash(this); }
    equals(other : mixed) : boolean {
        return other instanceof Record && hash(this) === hash(other);
    }
    toJSON() : $ObjMap<T, ($Values<T>) => mixed> {
        return ObjectUtil.map(this.properties, prop => {
            if (typeof prop === 'object' && prop && prop.toJSON) {
                return prop.toJSON();
            } else {
                return prop;
            }
        });
    }
    
    has(propertyName : string) : boolean {
        return this.properties.hasOwnProperty(propertyName);
    }
    get(propertyName : string) : ?$Values<T> {
        if (!this.properties.hasOwnProperty(propertyName)) {
            throw new TypeError(`No such property '${propertyName}'`);
        }
        
        return this.properties[propertyName];
    }
    
    
    // Collection functions
    // Treats this record as a collection (which is a little unnatural but often convenient)
    
    entries() : Dictionary<$Values<T>> {
        return new Dictionary(this.properties);
    }
    
    size() : number { return Object.keys(this.properties).length; }
    
    // Note: have to use comment syntax for @@iterator, because the babel flow transform doesn't understand it
    /*:: @@iterator() : Iterator<[K, $Values<T>]> { return (undefined : any); }*/
    // $FlowFixMe: computed property key
    *[Symbol.iterator]() : Iterator<[K, $Values<T>]> {
        for (const [key, value] of ObjectUtil.entries(this.properties)) {
            yield [key, value];
        }
    }
    
    // Note: we cannot rely derive the target object type further than we do here (`PropertyT`), because all
    // information we are given is one function's return type.
    mapToObject(fn : ($Values<T>, ?K) => PropertyT) : $ObjMap<T, ($Values<T>) => PropertyT> {
        return [...this]
            .map(([key, value]) => [key, fn(value, key)])
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    }
    
    map(fn : ($Values<T>, ?K) => PropertyT) : Record<$ObjMap<T, ($Values<T>) => PropertyT>> {
        return new Record(this.mapToObject(fn));
    }
    // mapToArray<B>(fn : (A, ?K) => B) : Array<[K, B]> { return [...this].map(fn); }
    // mapToString<B>(separator : string, fn : (A, ?K) => B) : string { this.mapToArray(fn).join(separator); }
}
