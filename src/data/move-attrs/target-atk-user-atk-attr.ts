import { Stat } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableAtkAttr } from "#app/data/move-attrs/variable-atk-attr";

export class TargetAtkUserAtkAttr extends VariableAtkAttr {
  constructor() {
    super();
  }
  override apply(_user: Pokemon, target: Pokemon, _move: Move, attackingStat: NumberHolder): boolean {
    attackingStat.value = target.getEffectiveStat(Stat.ATK, target);
    return true;
  }
}
