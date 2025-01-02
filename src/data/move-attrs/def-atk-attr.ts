import { Stat } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableAtkAttr } from "#app/data/move-attrs/variable-atk-attr";

/**
 * Attribute to change the attacking stat used for the move
 * to the user's Defense.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Body_Press_(move) Body Press}.
 * @extends VariableAtkAttr
 */
export class DefAtkAttr extends VariableAtkAttr {
  constructor() {
    super();
  }

  override apply(user: Pokemon, target: Pokemon, _move: Move, attackingStat: NumberHolder): boolean {
    attackingStat.value = user.getEffectiveStat(Stat.DEF, target);
    return true;
  }
}
