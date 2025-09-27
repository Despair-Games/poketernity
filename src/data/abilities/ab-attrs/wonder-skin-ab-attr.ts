import { PreDefendAbAttr } from "#abilities/pre-defend-ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { MoveCategory } from "#enums/move-category";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { ValueHolder } from "#utils/common-utils";

/**
 * Reduces the accuracy of status moves used against the Pokémon with this ability to 50%.
 * Used by Wonder Skin.
 */
export class WonderSkinAbAttr extends PreDefendAbAttr {
  constructor() {
    super();
    this._flags.add(AbAttrFlag.WONDER_SKIN);
  }

  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _attacker: Pokemon,
    _move: Move,
    moveAccuracy: ValueHolder<number>,
  ): void {
    moveAccuracy.value = 50;
  }

  public override canApply(...[, , , move, moveAccuracy]: Parameters<this["apply"]>): boolean {
    return move.category === MoveCategory.STATUS && moveAccuracy.value > 50;
  }
}
