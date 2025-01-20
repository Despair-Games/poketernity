import { Stat } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableAtkAttr } from "#app/data/move-attrs/variable-atk-attr";
import { AbilityApplyMode } from "#enums/ability-apply-mode";

/**
 * Attribute to change the attacking stat used for the move to the user's Defense.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Body_Press_(move) | Body Press}.
 * @extends VariableAtkAttr
 */
export class DefAtkAttr extends VariableAtkAttr {
  constructor() {
    super();
  }

  /**
   * @todo This wrongly ignores Unaware and does not preserve the effects of Huge Power and other Attack multipliers.
   * @see {@link https://github.com/Despair-Games/poketernity/issues/184 | #184}
   */
  override apply(user: Pokemon, target: Pokemon, move: Move, attackingStat: NumberHolder): boolean {
    attackingStat.value = user.getEffectiveStat(Stat.DEF, target, move, AbilityApplyMode.IGNORE);
    return true;
  }
}
