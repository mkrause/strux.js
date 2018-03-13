// @flow

const ObjectUtil = {
    // Flow-compatible versions of Object.values/entries(). Needed because flow currently
    // erases the types. (https://github.com/facebook/flow/issues/2174)
    entries: function<A>(obj : { [string]: A }) : Array<[string, A]> {
      const keys : string[] = Object.keys(obj);
      return keys.map(key => [key, obj[key]]);
    },
    values: function<A>(obj : { [string]: A }) : Array<A> {
      const keys : string[] = Object.keys(obj);
      return keys.map(key => obj[key]);
    },
    
    // Map a function over an object (returning another object)
    map: function<A, B>(obj : { [string] : A }, fn : (A, ?string) => B) : { [string] : B } {
        return Object.keys(obj)
            .map(key => [key, fn(obj[key], key)])
            .reduce((acc, [key, value]) => Object.assign(acc, { [key]: value }), {});
    },
};

export default ObjectUtil;
