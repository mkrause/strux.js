//@flow

import hash, { asHashable } from './util/hash.js';

import type { Hashable } from './interfaces/Hashable.js';
import type { Equatable } from './interfaces/Equatable.js';
import type { JsonSerializable } from './interfaces/JsonSerializable.js';

import Unit from './structures/Unit.js';
import Text from './structures/Text.js';
import Natural from './structures/Natural.js';
import Dictionary from './structures/Dictionary.js';
import Record from './structures/Record.js';
import Mapping from './structures/Mapping.js';


export { hash, asHashable };

export type { Hashable };
export type { Equatable };
export type { JsonSerializable };

export {
    Unit,
    Text,
    Natural,
    Dictionary,
    Record,
    Mapping,
};

export default {
    Unit,
    Text,
    Natural,
    Dictionary,
    Record,
    Mapping,
};
