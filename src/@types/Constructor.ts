// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { AbstractConstructor } from "#app/@types/AbstractConstructor";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

/**
 * Alias for the constructor of a class.
 * Can be used to build an object of templated type.
 *
 * Use {@linkcode AbstractConstructor} instead if comparing types
 */
export type Constructor<T> = new (...args: unknown[]) => T;
