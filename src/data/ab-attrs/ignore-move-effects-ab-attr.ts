import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { PreDefendAbAttr } from "./pre-defend-ab-attr";

/**
 * Sets incoming moves additional effect chance to zero, ignoring all effects from moves. ie. Shield Dust.
 * @extends PreDefendAbAttr
 * @see {@linkcode applyPreDefend}
 */
export class IgnoreMoveEffectsAbAttr extends PreDefendAbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.IGNORE_MOVE_EFFECTS);
  }

  /**
   * @param effectChance {@linkcode NumberHolder} Move additional effect chance.
   */
  override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _attacker: Pokemon,
    _move: Move,
    effectChance: NumberHolder,
  ): boolean {
    if (effectChance.value <= 0) {
      return false;
    }

    effectChance.value = 0;
    return true;
  }
}
