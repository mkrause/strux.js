// @flow

import type { Hashable } from './Hashable.js';


export interface Equatable {
    equals(other : Hashable) : boolean;
}
