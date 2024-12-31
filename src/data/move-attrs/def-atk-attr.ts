import { Stat } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableAtkAttr } from "#app/data/move-attrs/variable-atk-attr";

export class DefAtkAttr extends VariableAtkAttr {
  constructor() {
    super();
  }

  /**
   * Changes the attacking stat for the given attack to the user's Defense
   * @param user the {@linkcode Pokemon} using the move
   * @param target the {@linkcode Pokemon} targeted by the move
   * @param _move n/a
   * @param attackingStat a {@linkcode NumberHolder} containing the offensive stat
   * used for the current attack
   * @returns `true`
   */
  override apply(user: Pokemon, target: Pokemon, _move: Move, attackingStat: NumberHolder): boolean {
    attackingStat.value = user.getEffectiveStat(Stat.DEF, target);
    return true;
  }
}
