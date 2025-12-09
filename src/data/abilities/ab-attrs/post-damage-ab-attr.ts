import { AbAttr } from "#abilities/ab-attr";
import type { Pokemon } from "#field/pokemon";

/**
 * Triggers after the Pokemon takes any damage
 */
export abstract class PostDamageAbAttr extends AbAttr {
  protected override readonly abAttrKey = "PostDamageAbAttr";

  constructor() {
    super(true);
  }

  /**
   * Applies an effect after the Pokemon takes damage
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param damage The last instance of damage dealt to the Pokemon
   * @param source The {@linkcode Pokemon} who dealt damage to the ability owner
   * @returns `true` if effects successfully apply
   */
  public abstract override apply(_pokemon: Pokemon, _simulated: boolean, _damage: number, _source?: Pokemon): void;
}
