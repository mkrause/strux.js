// @flow

import env from '../util/env.js';
import hash, { asHashable } from '../util/hash.js';
import ObjectUtil from '../util/object_util.js';
import { isValidSymbol } from '../util/symbol.js';

import type { Hash, Hashable } from '../interfaces/Hashable.js';
import type { Equatable } from '../interfaces/Equatable.js';
import type { JsonSerializable } from '../interfaces/JsonSerializable.js';

import Dictionary from './DictionaryNonempty.js';


type K = string; // Key type
type PropertyT = void | null | boolean | string | number | (Hashable & Equatable & JsonSerializable);

export type RecordOf<T : { +[K] : PropertyT }> = Record<T> & T;

// A record (set of properties), which is a valid subtype of the type `T`. Records must be
// nonemty, i.e. they must have at least one property.
export default class Record<T : { +[K] : PropertyT }> implements Hashable, Equatable, JsonSerializable {
    // Note: because we store the properties as a JS object, the order is determined by the usual rules.
    // That means that number-like keys get sorted first. For us, this doesn't really matter because
    // number-like keys get rejected through the `isValidSymbol` check.
    properties : T;
    
    // Optional: create a record with direct property access. Requires you to use `RecordOf<T>`
    // as the type, instead of just `Record<T>`. Only works for property names that are not already
    // on Record's prototype.
    static of<T : { +[K] : PropertyT }>(properties : $Shape<T>) : RecordOf<T> {
        const record : any = new Record(properties);
        
        for (const propertyName of Object.keys(properties)) {
            if (propertyName in record) {
                // Ignore keys that already exist
                continue;
            }
            
            // Object.defineProperty(this, propertyName, {
            //     get: () => this.properties[propertyName],
            // });
            
            record[propertyName] = record.properties[propertyName];
        }
        
        return record;
    }
    
    constructor(properties : $Shape<T>) {
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
    
    
    // Access
    
    has(propertyName : $Keys<T>) : boolean {
        return this.properties.hasOwnProperty(propertyName);
    }
    get<P : $Keys<T>>(propertyName : P) : $ElementType<T, P> {
        if (!this.properties.hasOwnProperty(propertyName)) {
            throw new TypeError(`No such property '${propertyName}'`);
        }
        
        return this.properties[propertyName];
    }
    
    
    // Manipulation
    
    set<P : $Keys<T>>(propertyName : P, value : $ElementType<T, P>) : Record<T> {
        if (!this.properties.hasOwnProperty(propertyName)) {
            throw new TypeError(`No such property '${propertyName}'`);
        }
        
        return new Record({
            ...this.properties,
            [propertyName]: value,
        });
    }
    
    
    // Conversion
    
    // Returns this record's properties as a collection (dictionary) of entries, with the order maintained.
    entries() : Dictionary<$Values<T>> {
        return new Dictionary(this.properties);
    }
    
    
    // Collection functions
    // Treats this record as a collection (which is a little unnatural for a record type, but often convenient).
    
    size() : number { return Object.keys(this.properties).length; }
    
    // Note: have to use comment syntax for @@iterator, because the babel flow transform doesn't understand it
    /*:: @@iterator() : Iterator<[K, $Values<T>]> { return (undefined : any); }*/
    // $FlowFixMe: computed property key
    *[Symbol.iterator]() : Iterator<[K, $Values<T>]> {
        for (const [key, value] of ObjectUtil.entries(this.properties)) {
            yield [key, value];
        }
    }
    
    // Note: we are forced to simplify the type of the resulting object type to have all values of one
    // type `A`. This is because all the information we have is a function with return type `A`.
    mapToObject<A : mixed>(fn : ($Values<T>, ?K) => A) : $ObjMap<T, ($Values<T>) => A> {
        return [...this]
            .map(([key, value]) => [key, fn(value, key)])
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    }
    
    map<A : PropertyT>(fn : ($Values<T>, ?K) => A) : Record<$ObjMap<T, ($Values<T>) => A>> {
        return new Record(this.mapToObject(fn));
    }
    mapToArray<A : mixed>(fn : ($Values<T>, ?K) => A) : Array<A> {
        return [...this]
            .map(([key, value]) => fn(value, key));
    }
    mapToString<A : mixed>(separator : string, fn : ($Values<T>, ?K) => A) : string {
        return this.mapToArray(fn).join(separator);
    }
}
