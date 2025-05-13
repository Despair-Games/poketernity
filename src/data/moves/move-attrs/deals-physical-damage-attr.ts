import { Stat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariableDefAttr } from "#moves/variable-def-attr";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Attribute for Special attacks that deal physical damage,
 * e.g. {@link https://bulbapedia.bulbagarden.net/wiki/Psyshock_(move) | Psyshock}.
 * @extends VariableDefAttr
 */
export class DealsPhysicalDamageAttr extends VariableDefAttr {
  override apply(_user: Pokemon, _target: Pokemon, _move: Move, defendingStat: NumberHolder): boolean {
    defendingStat.value = Stat.DEF;
    return true;
  }
}
