
// Note: currently we allow `$` and `.` as part of a symbol name. In the future, we may
// disallow these (or reserve them for internal use).
// - `$`: used to mark something as internal
// - `.`: used for namespacing purposes (while still keeping a flat tree structure)
export const isValidSymbol = str => /[a-z_\$][a-z0-9_\$\.-]*/i.test(str);
