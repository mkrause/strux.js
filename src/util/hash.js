// @flow

import hashObject from 'object-hash';

import type { Hash, Hashable } from '../interfaces/Hashable.js';


// export const asHashable = Symbol('asHashable');
export const asHashable = '__asHashable';


/*
Some notes on the `object-hash` library:
  - Uses a one-way hash function like sha1 to generate an effectively unique hash
  - Performance:
    > On node, uses the `crypto` module, which is fairly fast
    > In the browser, has to use a polyfill, which is probably not so fast
    > Numerical hash codes seem like they may be faster (intuitively, need to test)

Alternatives:
  - ImmutableJS's hash utility
    https://github.com/facebook/immutable-js/blob/master/src/Hash.js
    > Numerical hash codes; very fast; however not globally unique (collisions are expected and common)
  - https://www.npmjs.com/package/node-object-hash
    > Doesn't work in the browser (?)
  - https://www.npmjs.com/package/oid
  - https://github.com/planttheidea/hash-it
    > Numerical hash codes
*/

const options = {
    algorithm: 'sha1', // For debugging: `passthrough`
    encoding: 'hex',
    
    // Do not inspect the prototype when hashing. This means that the caller is expected to disambiguate
    // the types of object themselves (by passing in a type discriminator to `hash()`).
    respectType: false,
    
    // Do not sort arrays, objects, or Map/Set (i.e. maintain the ordering)
    unorderedArrays: false,
    unorderedObjects: false,
    unorderedSets: false,
};

const cache : WeakMap<mixed, Hash> = new WeakMap();

export default (value : mixed) : Hash => {
    if (value === undefined) {
        // object-hash does not accept undefined
        // This makes sense, `undefined` should be considered the lack of an argument.
        throw new TypeError('Cannot hash `undefined`');
    }
    
    let valueHashable = value;
    if (typeof value === 'object' && value !== null && asHashable in value) {
        if (typeof value[asHashable] !== 'function') {
            throw new TypeError('asHashable should be a function');
        }
        const getAsHashable : () => mixed = value[asHashable];
        valueHashable = getAsHashable.call(value);
    }
    
    if (typeof valueHashable === 'object') {
        if (cache.has(valueHashable)) {
            return (cache.get(valueHashable) : any); // Type cast (assure flow that the cache entry exists)
        }
    }
    
    const hash = hashObject(valueHashable, options);
    
    if (typeof valueHashable === 'object') {
        cache.set(valueHashable, hash);
    }
    
    return hash;
};
