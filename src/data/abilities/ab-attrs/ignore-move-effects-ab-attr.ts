import { PreDefendAbAttr } from "#abilities/pre-defend-ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { ValueHolder } from "#utils/common-utils";

/**
 * Sets incoming moves additional effect chance to zero, ignoring all effects from moves. ie. Shield Dust.
 * @see {@linkcode applyPreDefend}
 */
export class IgnoreMoveEffectsAbAttr extends PreDefendAbAttr {
  constructor() {
    super();
    this._flags.add(AbAttrFlag.IGNORE_MOVE_EFFECTS);
  }

  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _attacker: Pokemon,
    _move: Move,
    effectChance: ValueHolder<number>,
  ): void {
    effectChance.value = 0;
  }

  public override canApply(...[, , , , effectChance]: Parameters<this["apply"]>): boolean {
    return effectChance.value > 0;
  }
}
