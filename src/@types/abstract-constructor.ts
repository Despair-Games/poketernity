/**
 * Alias for an abstract constructor of a class.
 * Should be used when comparing types, e.g. with `instanceof`.
 */
export type AbstractConstructor<T> = abstract new (...args: unknown[]) => T;
