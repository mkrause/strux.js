// @flow

// Utility functions to work with ES6 Maps

// Create a generator for an object's entries
// https://stackoverflow.com/a/36644965/233884
function* entries(obj) {
    // Note: we don't check for `hasOwnProperty()`. We assume that there are no enumerable
    // properties in the object that we should ignore (see the SO link for discussion).
    for (let key in obj) {
        yield [key, obj[key]];
    }
}

const MapUtil = {
    fromObject<A>(obj : { +[string] : A }) : Map<string, A> {
        return new Map(entries(obj));
    },
    
    // Map a function over a Map (returning another Map)
    map<K, A, B>(map : Map<K, A>, fn : (A, ?string) => B) : Map<K, B> {
        return new Map(function*() {
            for (const [key, value] of map.entries()) {
                yield [key, fn(value, key)];
            }
        }());
    },
};

export default MapUtil;
