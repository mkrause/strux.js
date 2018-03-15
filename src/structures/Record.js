// @flow

import env from '../util/env.js';
import hash, { asHashable } from '../util/hash.js';
import ObjectUtil from '../util/object_util.js';
import { isValidSymbol } from '../util/symbol.js';

import type { Hashable } from '../interfaces/Hashable.js';
import type { Equatable } from '../interfaces/Equatable.js';
import type { JsonSerializable } from '../interfaces/JsonSerializable.js';


type PropertyT = Hashable & Equatable & JsonSerializable;

// A record (set of properties), which is a valid instance of the type `T`
export default class Record<T : { [string] : PropertyT }> implements Hashable, Equatable, JsonSerializable {
    properties : T;
    
    constructor(properties : *) {
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
        
        Object.assign(this, { properties });
    }
    
    // $FlowFixMe
    [asHashable]() {
        return ObjectUtil.map(this.properties, hash);
    }
    hash() { return hash(this); }
    equals(other : Hashable) {
        return other instanceof Record && hash(this) === hash(other);
    }
    toJSON() {
        return ObjectUtil.map(this.properties, prop => {
            if (typeof prop === 'object' && prop && prop.toJSON) {
                return prop.toJSON();
            } else {
                return prop;
            }
        });
    }
    
    size() {
        return Object.keys(this.properties).length;
    }
    
    has(propertyName : string) {
        return this.properties.hasOwnProperty(propertyName);
    }
    get(propertyName : string) {
        if (!this.properties.hasOwnProperty(propertyName)) {
            throw new TypeError(`No such property '${propertyName}'`);
        }
        
        return this.properties[propertyName];
    }
}
