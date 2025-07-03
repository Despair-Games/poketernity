/**
 * Alias for the constructor of a class.
 * Can be used to build an object of templated type.
 *
 * Use {@linkcode AbstractConstructor} instead if comparing types
 */
export type Constructor<T> = new (...args: unknown[]) => T;

/**
 * Alias for an abstract constructor of a class.
 * Should be used when comparing types, e.g. with `instanceof`.
 */
export type AbstractConstructor<T> = abstract new (...args: unknown[]) => T;

/** Utility type representing `null` or `undefined` */
export type nil = null | undefined;

export type ConditionFn = (...args: unknown[]) => boolean;

export type EnumValues<T> = T[keyof T];
