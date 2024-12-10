import type Pokemon from "#app/field/pokemon";
import type { BooleanHolder, NumberHolder } from "#app/utils";
import type Move from "../move";
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
    if ((args[0] as NumberHolder).value <= 0) {
      return false;
    }

    (args[0] as NumberHolder).value = 0;
    return true;
  }
}
