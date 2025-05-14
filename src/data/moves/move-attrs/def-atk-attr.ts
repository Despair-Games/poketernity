import { AbilityApplyMode } from "#enums/ability-apply-mode";
import { Stat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariableAtkAttr } from "#moves/variable-atk-attr";

/**
 * Attribute to change the attacking stat used for the move to the user's Defense.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Body_Press_(move) | Body Press}.
 * @extends VariableAtkAttr
 */
export class DefAtkAttr extends VariableAtkAttr {
  constructor() {
    super();
  }

  override getStatOverride(user: Pokemon, target: Pokemon, move: Move, isCritical: boolean) {
    return user.getStageMultipliedStat(Stat.DEF, target, move, AbilityApplyMode.DEFAULT, isCritical);
  }
}
