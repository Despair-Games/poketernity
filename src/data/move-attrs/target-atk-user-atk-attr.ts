import { Stat } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableAtkAttr } from "#app/data/move-attrs/variable-atk-attr";

/**
 * Attribute to set the offensive stat used for the move's attack
 * to the target's Attack stat.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Foul_Play_(move) Foul Play}.
 * @extends VariableAtkAttr
 */
export class TargetAtkUserAtkAttr extends VariableAtkAttr {
  constructor() {
    super();
  }

  override apply(_user: Pokemon, target: Pokemon, _move: Move, attackingStat: NumberHolder): boolean {
    attackingStat.value = target.getEffectiveStat(Stat.ATK, target);
    return true;
  }
}
