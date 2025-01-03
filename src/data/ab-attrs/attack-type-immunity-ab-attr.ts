import type { AbAttrCondition } from "#app/@types/AbAttrCondition";
import { type Move } from "#app/data/move";
import { NeutralDamageAgainstFlyingTypeMultiplierAttr } from "../move-attrs/neutral-damage-against-flying-type-multiplier-attr";
import { MoveCategory } from "../../enums/move-category";
import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import type { Type } from "#enums/type";
import { TypeImmunityAbAttr } from "./type-immunity-ab-attr";

/**
 * Applies immunity if the move used is not a status move.
 * Type immunity abilities that do not give additional benefits (HP recovery, stat boosts, etc) are not immune to status moves of the type.
 *
 * Example: Levitate
 * @extends TypeImmunityAbAttr
 */
export class AttackTypeImmunityAbAttr extends TypeImmunityAbAttr {
  constructor(immuneType: Type, condition?: AbAttrCondition) {
    super(immuneType, condition);
  }

  override applyPreDefend(
    pokemon: Pokemon,
    passive: boolean,
    simulated: boolean,
    attacker: Pokemon,
    move: Move,
    cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    // this is a hacky way to fix the Levitate/Thousand Arrows interaction, but it works for now...
    if (
      attacker.getMoveCategory(pokemon, move) !== MoveCategory.STATUS
      && !move.hasAttr(NeutralDamageAgainstFlyingTypeMultiplierAttr)
    ) {
      return super.applyPreDefend(pokemon, passive, simulated, attacker, move, cancelled, args);
    }
    return false;
  }
}
