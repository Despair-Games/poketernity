import { Stat } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableDefAttr } from "#app/data/move-attrs/variable-def-attr";

/**
 * Attribute for Special attacks that deal physical damage,
 * e.g. {@link https://bulbapedia.bulbagarden.net/wiki/Psyshock_(move) Psyshock}.
 * @extends VariableDefAttr
 */
export class DealsPhysicalDamageAttr extends VariableDefAttr {
  constructor() {
    super();
  }

  override apply(user: Pokemon, target: Pokemon, _move: Move, defendingStat: NumberHolder): boolean {
    defendingStat.value = target.getEffectiveStat(Stat.DEF, user);
    return true;
  }
}
