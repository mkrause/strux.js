//@flow

import hash, { asHashable } from './util/hash.js';

import type { Hashable } from './interfaces/Hashable.js';
import type { Equatable } from './interfaces/Equatable.js';
import type { JsonSerializable } from './interfaces/JsonSerializable.js';

import Unit from './structures/Unit.js';
import Text from './structures/Text.js';
import TextNonempty from './structures/TextNonempty.js';
import Natural from './structures/Natural.js';
import NaturalNonempty from './structures/NaturalNonempty.js';
import Dictionary from './structures/Dictionary.js';
import DictionaryNonempty from './structures/DictionaryNonempty.js';
import Record from './structures/Record.js';
import Mapping from './structures/Mapping.js';
import MappingNonempty from './structures/MappingNonempty.js';

import { isValidSymbol } from './util/symbol.js';


export { hash, asHashable };

export type { Hashable };
export type { Equatable };
export type { JsonSerializable };

export {
    Unit,
    Text,
    TextNonempty,
    Natural,
    NaturalNonempty,
    Dictionary,
    DictionaryNonempty,
    Record,
    Mapping,
    MappingNonempty,
};

export default {
    Unit,
    Text,
    TextNonempty,
    Natural,
    NaturalNonempty,
    Dictionary,
    DictionaryNonempty,
    Record,
    Mapping,
    MappingNonempty,
    
    isValidSymbol,
};
