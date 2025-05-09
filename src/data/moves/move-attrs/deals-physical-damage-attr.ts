import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils/common-utils";
import { Stat } from "#enums/stat";
import { VariableDefAttr } from "#moves/variable-def-attr";

/**
 * Attribute for Special attacks that deal physical damage,
 * e.g. {@link https://bulbapedia.bulbagarden.net/wiki/Psyshock_(move) | Psyshock}.
 * @extends VariableDefAttr
 */
export class DealsPhysicalDamageAttr extends VariableDefAttr {
  constructor() {
    super();
  }

  override apply(_user: Pokemon, _target: Pokemon, _move: Move, defendingStat: NumberHolder): boolean {
    defendingStat.value = Stat.DEF;
    return true;
  }
}
