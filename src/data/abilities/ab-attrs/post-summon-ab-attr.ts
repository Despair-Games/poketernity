import { AbAttr } from "#abilities/ab-attr";
import type { Pokemon } from "#field/pokemon";
import type { AbAttrKey } from "#types/ability-types";

/**
 * Base class for effects that activate when the source Pokemon enters the field.
 * @todo Most post-summon abilities should activate when the pokemon gains the ability (such as from Skill Swap)
 */
export abstract class PostSummonAbAttr extends AbAttr {
  protected override readonly abAttrKey: AbAttrKey = "PostSummonAbAttr";

  constructor(showAbility: boolean = true) {
    super(showAbility);
  }

  /**
   * Applies ability post summon (after switching in)
   * @param pokemon {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param args Set of unique arguments needed by this attribute
   */
  public abstract override apply(_pokemon: Pokemon, _simulated: boolean, ..._args: unknown[]): void;
}
