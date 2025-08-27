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

/**
 * Type helper that iterates through the fields of the type
 * and coerces any `null` properties to `undefined` (including in union types).
 *
 * @remarks
 * This is primarily useful when an object with nullable properties wants to be serialized
 * and have its `null` properties coerced to `undefined`.
 */
export type CoerceNullPropertiesToUndefined<T extends object> = {
  [K in keyof T]: null extends T[K] ? Exclude<T[K], null> | undefined : T[K];
};

/**
 * Type helper that matches any `Function` type.
 * Equivalent to `Function`, but will not raise a warning from Biome.
 */
export type AnyFn = (...args: any[]) => any;
