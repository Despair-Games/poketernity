import type Pokemon from "#app/field/pokemon";
import { AbAttr } from "./ab-attr";

/**
 * Base class for defining all {@linkcode Ability} Attributes post summon
 * @see {@linkcode applyPostSummon()}
 */
export class PostSummonAbAttr extends AbAttr {
  /**
   * Applies ability post summon (after switching in)
   * @param _pokemon {@linkcode Pokemon} with this ability
   * @param _passive Whether this ability is a passive
   * @param _args Set of unique arguments needed by this attribute
   * @returns true if application of the ability succeeds
   */
  applyPostSummon(_pokemon: Pokemon, _passive: boolean, _simulated: boolean, _args: any[]): boolean {
    return false;
  }
}
