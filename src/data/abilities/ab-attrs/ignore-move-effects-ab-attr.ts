import { PreDefendAbAttr } from "#abilities/pre-defend-ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Sets incoming moves additional effect chance to zero, ignoring all effects from moves. ie. Shield Dust.
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
  public override apply(
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
