import type Pokemon from "#app/field/pokemon";
import { type BooleanHolder, type NumberHolder, toDmgValue } from "#app/utils";
import type Move from "../move";
import { PreDefendAbAttr } from "./pre-defend-ab-attr";

/**
 * Reduces the damage dealt to an allied Pokemon. Used by Friend Guard.
 * @see {@linkcode applyPreDefend}
 */
export class AlliedFieldDamageReductionAbAttr extends PreDefendAbAttr {
  private damageMultiplier: number;

  constructor(damageMultiplier: number) {
    super();
    this.damageMultiplier = damageMultiplier;
  }

  /**
   * Handles the damage reduction
   * @param args
   * - `[0]` {@linkcode NumberHolder} - The damage being dealt
   */
  override applyPreDefend(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _attacker: Pokemon,
    _move: Move,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    const damage = args[0] as NumberHolder;
    damage.value = toDmgValue(damage.value * this.damageMultiplier);
    return true;
  }
}
