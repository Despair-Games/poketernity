import { Stat } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableAtkAttr } from "#app/data/move-attrs/variable-atk-attr";
import { AbilityApplyMode } from "#enums/ability-apply-mode";

/**
 * Attribute to set the offensive stat used for the move's attack to the target's Attack stat.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Foul_Play_(move) | Foul Play}.
 * @extends VariableAtkAttr
 */
export class TargetAtkUserAtkAttr extends VariableAtkAttr {
  constructor() {
    super();
  }

  /**
   * @todo This wrongly ignores the user's Unaware and does not preserve the effects of Huge Power, etc.
   * @see {@link https://github.com/Despair-Games/poketernity/issues/184 | #184}
   */
  override apply(_user: Pokemon, target: Pokemon, move: Move, attackingStat: NumberHolder): boolean {
    attackingStat.value = target.getEffectiveStat(Stat.ATK, target, move, AbilityApplyMode.IGNORE);
    return true;
  }
}
