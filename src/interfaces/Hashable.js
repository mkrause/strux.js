// @flow

export opaque type Hash : string = string;

export interface Hashable {
    hash() : Hash;
}
