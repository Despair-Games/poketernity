import type { Pokemon } from "#app/field/pokemon";
import { AbAttr } from "./ab-attr";

/**
 * Base class for defining all {@linkcode Ability} Attributes post summon
 * @see {@linkcode applyPostSummon()}
 */
export class PostSummonAbAttr extends AbAttr {
  /**
   * Applies ability post summon (after switching in)
   * @param pokemon {@linkcode Pokemon} with this ability
   * @param passive Whether this ability is a passive
   * @param args Set of unique arguments needed by this attribute
   * @returns true if application of the ability succeeds
   */
  override apply(_pokemon: Pokemon, _simulated: boolean, ..._args: unknown[]): boolean {
    return false;
  }
}
