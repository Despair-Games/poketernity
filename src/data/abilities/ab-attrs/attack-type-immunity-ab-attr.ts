import type { AbAttrCondition } from "#app/@types/AbAttrCondition";
import { type Move } from "#app/data/moves/move";
import { NeutralDamageAgainstFlyingTypeMultiplierAttr } from "#app/data/moves/move-attrs/neutral-damage-against-flying-type-multiplier-attr";
import { MoveCategory } from "#enums/move-category";
import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder, NumberHolder } from "#app/utils";
import type { ElementalType } from "#enums/elemental-type";
import { TypeImmunityAbAttr } from "./type-immunity-ab-attr";

/**
 * Applies immunity if the move used is not a status move.
 * Type immunity abilities that do not give additional benefits (HP recovery, stat boosts, etc) are not immune to status moves of the type.
 *
 * Example: Levitate
 * @extends TypeImmunityAbAttr
 */
export class AttackTypeImmunityAbAttr extends TypeImmunityAbAttr {
  constructor(immuneType: ElementalType, condition?: AbAttrCondition) {
    super(immuneType, condition);
  }

  override apply(
    pokemon: Pokemon,
    simulated: boolean,
    attacker: Pokemon,
    move: Move,
    cancelled: BooleanHolder,
    typeMultiplier: NumberHolder,
  ): boolean {
    // this is a hacky way to fix the Levitate/Thousand Arrows interaction, but it works for now...
    if (
      attacker.getMoveCategory(pokemon, move) !== MoveCategory.STATUS
      && !move.hasAttr(NeutralDamageAgainstFlyingTypeMultiplierAttr)
    ) {
      return super.apply(pokemon, simulated, attacker, move, cancelled, typeMultiplier);
    }
    return false;
  }
}
