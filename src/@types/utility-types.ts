/**
 * Alias for the constructor of a class.
 * Can be used to build an object of templated type.
 * @remarks
 * Use {@linkcode AbstractConstructor} instead if comparing types
 */
export type Constructor<T> = new (...args: any[]) => T;

/**
 * Alias for an abstract constructor of a class.
 * Should be used when comparing types, e.g. with `instanceof`.
 */
export type AbstractConstructor<T> = abstract new (...args: any[]) => T;

/** Utility type representing `null` or `undefined` */
export type nil = null | undefined;

export type AchvConditionFn<T = any> = (...args: T[]) => boolean;

export type ObjectValues<T extends object> = T[keyof T];

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
 * Type helper that matches any `Function` type. \
 * Equivalent to `Function`, but will not raise a warning from Biome.
 */
export type AnyFn = (...args: any[]) => any;

/**
 * Type helper to extract non-function properties from a type.
 *
 * @remarks
 * Useful to produce a type that is roughly the same as the type of `{... obj}`, where `obj` is an instance of `T`. \
 * A couple of differences:
 * - Private and protected properties are not included.
 * - Nested properties are not recursively extracted. For this, use {@linkcode NonFunctionPropertiesRecursive}
 */
export type NonFunctionProperties<T> = {
  [K in keyof T as T[K] extends AnyFn ? never : K]: T[K];
};

/** Type helper to extract out non-function properties from a type, recursively applying to nested properties. */
export type NonFunctionPropertiesRecursive<Class> = {
  [K in keyof Class as Class[K] extends AnyFn ? never : K]: Class[K] extends Array<infer U>
    ? NonFunctionPropertiesRecursive<U>[]
    : Class[K] extends object
      ? NonFunctionPropertiesRecursive<Class[K]>
      : Class[K];
};

/**
 * Remove `readonly` from all properties of the provided type.
 * @typeParam T - The type to make mutable.
 */
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

/** Requires an array to contain at least one item. */
export type NonEmptyArray<T> = [T, ...T[]];

/**
 * Type helper to obtain the keys associated with a given value inside an object. \
 * Acts similar to {@linkcode Pick}, except checking the object's values instead of its keys.
 * @typeParam O - The type of the object
 * @typeParam V - The type of one of O's values
 */
export type InferKeys<O extends object, V> = {
  [K in keyof O]: O[K] extends V ? K : never;
}[keyof O];

// #region Enum Types
// temporary, will not be necessary after all TypeScript Enums are removed

/** Union type accepting any TS Enum or `const object`, with or without reverse mapping. */
export type EnumOrObject = Record<string | number, string | number>;

/**
 * Generic type constraint representing a TS numeric enum with reverse mappings.
 * @example
 * TSNumericEnum<typeof WeatherType>
 */
export type TSNumericEnum<T extends EnumOrObject> = number extends ObjectValues<T> ? T : never;

/** Generic type constraint representing a non reverse-mapped TS enum or `const object`. */
export type NormalEnum<T extends EnumOrObject> = Exclude<T, TSNumericEnum<T>>;

// #endregion
