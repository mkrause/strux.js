// @flow

import hashObject from 'object-hash';

import type { Hashable } from '../interfaces/Hashable.js';


// export const asHashable = Symbol('asHashable');
export const asHashable = '__asHashable';


/*
Some notes on the `object-hash` library:
  - Object keys are always sorted (so key order does not matter)
  - Hashes are strings (rather than numerical hash codes)
  - Performance:
    > Numerical hash codes may be faster.

Alternatives:
  - ImmutableJS's hash utility
    https://github.com/facebook/immutable-js/blob/master/src/Hash.js
    > Numerical hash codes; very fast; however not globally unique (duplicates are common)
  - https://www.npmjs.com/package/oid
  - https://github.com/planttheidea/hash-it
    > Numerical hash codes
*/

const options = {
    algorithm: 'sha1',
    encoding: 'hex',
    
    // Do not inspect the prototype when hashing. This means that the caller is expected to disambiguate
    // the types of object themselves (by passing in a type discriminator to `hash()`).
    respectType: false,
    
    // Do not sort Map and Set
    unorderedSets: false,
};

const cache = new WeakMap();

export default (value : any) : string => {
    if (typeof value === 'object') {
        if (cache.has(value)) {
            return (cache.get(value) : any); // Type cast (assure flow that the cache entry exists)
        }
    }
    
    let valueAsHashable = value;
    if (typeof value === 'object' && value !== null && asHashable in value) {
        valueAsHashable = value[asHashable]();
    }
    
    const hash = hashObject(value, options);
    
    if (typeof value === 'object') {
        cache.set(value, hash);
    }
    
    return hash;
};
