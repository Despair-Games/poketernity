import { Stat } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/moves/move";
import { VariableAtkAttr } from "#app/data/moves/move-attrs/variable-atk-attr";
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

  override getStatOverride(user: Pokemon, target: Pokemon, move: Move, isCritical: boolean) {
    return target.getStageMultipliedStat(Stat.ATK, user, move, AbilityApplyMode.DEFAULT, isCritical);
  }
}
