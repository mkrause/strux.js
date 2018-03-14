
# strux

A set of immutable ([persistent](https://en.wikipedia.org/wiki/Persistent_data_structure)) data structures. Type annotations are provided through [flow](https://flow.org).


## Motivation

This library is similar to existing libraries like [ImmutableJS](https://facebook.github.io/immutable-js). I created strux because I needed something lean, simple, and with a slightly customized API compared to what's already out there.

A couple of notable differences:

    * Rely on flow for static type checking whenever possible. For example ,rather than using runtime type checking of record types (like ImmutableJS `Record`), we rely on flow generics using `Record<T>` (where `T` is the record type).

    * Data types in strux are generally *nonempty* types. That is, they exclude the "empty" value of that type. For example, a dictionary with zero entries is not a valid instance of `Dictionary`, and an empty string is not a valid instance of `Text`. In more technical terms, we say that these types are [semigroups](https://en.wikipedia.org/wiki/Semigroup) rather than monoids. The reason we default to nonempty types is that it helps to prevent bugs caused by mishandling of edge cases. Expanding a nonempty type to a allow empty values is still easy, by using a maybe type (`?type` in flow).


## Interfaces

* `Hashable`: support a `hash()` method to calculate the hash of some value object.

    ```js
    interface Hashable {
        hash() : string;
    }
    ```

* `Equatable`: support equality checking between two objects.

    ```js
    interface Equatable {
        equals(other : Hashable) : boolean;
    }
    ```

* `JsonSerializable`: support JSON serialization through `toJSON()`.

    ```js
    interface JsonSerializable {
        toJSON() : any;
    }
    ```


## Structures

**Primitives**

* `Unit`

Represents the empty value.


* `Text`

Represents a textual value (i.e. a piece of Unicode text). Can be constructed from any JavaScript string, excluding the empty string `""`.


* `Natural`

Represents a natural number. Can be constructed from any finite integer greater than zero.


**Compounds**

* `Dictionary<A>`
* `Record<T : { +[string] : any }>`
* `Mapping<K, V>`
