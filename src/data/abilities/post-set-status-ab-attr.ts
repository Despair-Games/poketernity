import type Pokemon from "#app/field/pokemon";
import type { StatusEffect } from "#enums/status-effect";
import { AbAttr } from "./ab-attr";

/**
 * Base class for defining all {@linkcode Ability} Attributes after a status effect has been set.
 * @see {@linkcode applyPostSetStatus()}.
 */
export class PostSetStatusAbAttr extends AbAttr {
  /**
   * Does nothing after a status condition is set.
   * @param _pokemon {@linkcode Pokemon} that status condition was set on.
   * @param _sourcePokemon {@linkcode Pokemon} that that set the status condition. Is `null` if status was not set by a Pokemon.
   * @param _passive Whether this ability is a passive.
   * @param _effect {@linkcode StatusEffect} that was set.
   * @param _args Set of unique arguments needed by this attribute.
   * @returns `true` if application of the ability succeeds.
   */
  applyPostSetStatus(
    _pokemon: Pokemon,
    _sourcePokemon: Pokemon | null = null,
    _passive: boolean,
    _effect: StatusEffect,
    _simulated: boolean,
    _args: any[],
  ): boolean {
    return false;
  }
}
