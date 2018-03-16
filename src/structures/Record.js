// @flow

import env from '../util/env.js';
import hash, { asHashable } from '../util/hash.js';
import ObjectUtil from '../util/object_util.js';
import { isValidSymbol } from '../util/symbol.js';

import type { Hashable } from '../interfaces/Hashable.js';
import type { Equatable } from '../interfaces/Equatable.js';
import type { JsonSerializable } from '../interfaces/JsonSerializable.js';


// Note: it seems we cannot constrain the property type. Using an intersection type doesn't do what
// we might expect for `T : PropertyT`, flow will instead attempt to find one branch that satisfies
// all properties in an instantiation of `T`.
//type PropertyT = string | number | (Hashable & Equatable & JsonSerializable);
type PropertyT = any;

// A record (set of properties), which is a valid instance of the type `T`
export default class Record<T : { [string] : PropertyT }> implements Hashable, Equatable, JsonSerializable {
    properties : T;
    
    constructor(properties : T) {
        if (Object.keys(properties).length === 0) {
            throw new TypeError(`Record cannot be empty`);
        }
        
        if (env.debug) {
            Object.keys(properties).forEach(propertyName => {
                if (!isValidSymbol(propertyName)) {
                    throw new TypeError(`Invalid symbol: '${propertyName}'`);
                }
            });
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
    
    // $FlowFixMe
    [asHashable]() {
        return ObjectUtil.map(this.properties, hash);
    }
    hash() : string { return hash(this); }
    equals(other : Hashable) : boolean {
        return other instanceof Record && hash(this) === hash(other);
    }
    toJSON() : $ObjMap<T, <V>(v : $Keys<T>) => any> {
        return ObjectUtil.map(this.properties, prop => {
            if (typeof prop === 'object' && prop && prop.toJSON) {
                return prop.toJSON();
            } else {
                return prop;
            }
        });
    }
    
    size() : number {
        return Object.keys(this.properties).length;
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
}
