import type { Pokemon } from "#app/field/pokemon";
import { type NumberHolder, toDmgValue } from "#app/utils";
import type { Move } from "#app/data/move";
import { FixedDamageAttr } from "#app/data/move-attrs/fixed-damage-attr";

/**
 * Attribute to set move damage equal to half the target's remaining HP.
 * If this move is boosted by {@linkcode PokemonMultiHitModifier | Multi-Lens},
 * damage is adjusted such that the combined damage of all hits is
 * equal to half the target's remaining HP.
 * @extends FixedDamageAttr
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Move_variations#Variations_of_Super_Fang | Variations of Super Fang}
 */
export class TargetHalfHpDamageAttr extends FixedDamageAttr {
  constructor() {
    super(0);
  }

  // TODO: re-add multi lens check when it is re-implemented
  override apply(_user: Pokemon, target: Pokemon, _move: Move, damage: NumberHolder): boolean {
    // no multi lenses; we can just halve the target's hp and call it a day
    damage.value = toDmgValue(target.hp / 2);
    return true;
  }

  override getTargetBenefitScore(_user: Pokemon, target: Pokemon, _move: Move): number {
    return target.getHpRatio() > 0.5 ? Math.floor((target.getHpRatio() - 0.5) * -24 + 4) : -20;
  }
}
