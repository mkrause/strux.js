
# strux

A set of immutable ([persistent](https://en.wikipedia.org/wiki/Persistent_data_structure)) data structures. Uses [flow](https://flow.org) for static type checking.


## Motivation

This library is similar to existing libraries like [ImmutableJS](https://facebook.github.io/immutable-js). I created strux because none of the libraries I could find matched my needs. A few notable ways in which strux is different:

* strux makes heavy use of modern JavaScript features like `Map` (for true ordered dictionaries, and efficient maps on arbitrary keys), and `WeakMap` (for caching).

* We rely on flow for static type checking whenever possible. For example, rather than using runtime type checking of record types (like ImmutableJS `Record`), we rely on flow generics using `Record<T>` (where `T` is the record type).

* Data types in strux are generally *nonempty* types. That is, they exclude the "empty" value of that type. For example, a dictionary with zero entries is not a valid instance of `Dictionary`, and an empty string is not a valid instance of `Text`. In more technical terms, we say that these types are [semigroups](https://en.wikipedia.org/wiki/Semigroup) rather than monoids. The reason we default to nonempty types is that it helps to prevent bugs caused by mishandling of edge cases. Expanding a nonempty type to a allow empty values is still easy, by using a maybe type (`?type` in flow).

Unlike something like ImmutableJS, strux has not (yet) been optimized by any means. If you're working with large data sets, or have stringent performance requirements, you probably don't want to use library.


## Interfaces

* `Hashable`: support a `hash()` method to calculate a unique hash for some value object.

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

Represents the empty value. Serves a purpose similar to `null` in JS.


* `Text`

Represents a textual value (i.e. a piece of Unicode text). Can be constructed from any JS string, excluding the empty string `""`.

```js
const message = new Text('hello');
message.equals(new Text('hello')); // true
message.toString(); // 'hello'
```


* `Natural`

Represents a natural number. Can be constructed from any finite JS integer greater than zero.

```js
const count = new Natural(42);
count.equals(new Natural(42)); // true
count.valueOf(); // 42
```


**Compounds**

* `Dictionary<A>`

A mapping from symbols (strings) to values of type `A`. Similar to a JS object, in that keys are always textual. But meant specifically for collections of items of the same type (`A`). In contrast, objects that represent a single (record) type should use the `Record` type.

```js
const scores = new Dictionary({
    john: 42,
    alice: 101,
});
scores.get('john'); // 42
count.toJSON(); // { john: 42, alice: 101 }
```

* `Record<T>`

A record of type `T`. For example, to represent a person with a name field, and a numerical score:

```js
type Person = { +name: string, +score: number };
const john : Record<Person> = new Record({ name: 'John', score: 42 });
john.get('name'); // 'John'
```

* `Mapping<K, V>`

A mapping from arbitrary keys (type `K`) to arbitrary values (type `V`).

```js
type Person = { +name: string, +score: number };
const users = new Mapping({
    john: new Record<Person>({ name: 'John', score: 42 }),
    alice: new Record<Person>({ name: 'Alice', score: 101 }),
});
users.get('alice').get('score'); // 101
```
