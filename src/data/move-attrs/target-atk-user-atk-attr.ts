import { Stat } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableAtkAttr } from "#app/data/move-attrs/variable-atk-attr";

export class TargetAtkUserAtkAttr extends VariableAtkAttr {
  constructor() {
    super();
  }

  /** Sets the offensive stat used for the current attack equal to the target's Attack stat */
  override apply(_user: Pokemon, target: Pokemon, _move: Move, attackingStat: NumberHolder): boolean {
    attackingStat.value = target.getEffectiveStat(Stat.ATK, target);
    return true;
  }
}
