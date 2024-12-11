import type Move from "#app/data/move";
import type Pokemon from "#app/field/pokemon";
import type { BooleanHolder, NumberHolder } from "#app/utils";
import { PreDefendAbAttr } from "./pre-defend-ab-attr";

/**
 * Sets incoming moves additional effect chance to zero, ignoring all effects from moves. ie. Shield Dust.
 * @extends PreDefendAbAttr
 * @see {@linkcode applyPreDefend}
 */
export class IgnoreMoveEffectsAbAttr extends PreDefendAbAttr {
  /**
   * @param args [0]: {@linkcode NumberHolder} Move additional effect chance.
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
    const effectChance: NumberHolder = args[0];
    if (effectChance.value <= 0) {
      return false;
    }

    effectChance.value = 0;
    return true;
  }
}
