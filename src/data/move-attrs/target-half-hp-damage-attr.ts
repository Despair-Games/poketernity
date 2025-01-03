import type { Pokemon } from "#app/field/pokemon";
import { PokemonMultiHitModifier } from "#app/modifier/modifier";
import { type NumberHolder, toDmgValue } from "#app/utils";
import type { Move } from "#app/data/move";
import { FixedDamageAttr } from "#app/data/move-attrs/fixed-damage-attr";

/**
 * Attribute to set move damage equal to half the target's remaining HP.
 * If this move is boosted by {@linkcode PokemonMultiHitModifier Multi-Lens},
 * damage is adjusted such that the combined damage of all hits is
 * equal to half the target's remaining HP.
 * @extends FixedDamageAttr
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Move_variations#Variations_of_Super_Fang Variations of Super Fang}
 */
export class TargetHalfHpDamageAttr extends FixedDamageAttr {
  // the initial amount of hp the target had before the first hit
  // used for multi lens
  private initialHp: number;
  constructor() {
    super(0);
  }

  override apply(user: Pokemon, target: Pokemon, _move: Move, damage: NumberHolder): boolean {
    // first, determine if the hit is coming from multi lens or not
    const lensCount =
      user
        .getHeldItems()
        .find((i) => i instanceof PokemonMultiHitModifier)
        ?.getStackCount() ?? 0;
    if (lensCount <= 0) {
      // no multi lenses; we can just halve the target's hp and call it a day
      damage.value = toDmgValue(target.hp / 2);
      return true;
    }

    // figure out what hit # we're on
    switch (user.turnData.hitCount - user.turnData.hitsLeft) {
      case 0:
        // first hit of move; update initialHp tracker
        this.initialHp = target.hp;
      default:
        // multi lens added hit; use initialHp tracker to ensure correct damage
        damage.value = toDmgValue(this.initialHp / 2);
        return true;
      case lensCount + 1:
        // parental bond added hit; calc damage as normal
        damage.value = toDmgValue(target.hp / 2);
        return true;
    }
  }

  override getTargetBenefitScore(_user: Pokemon, target: Pokemon, _move: Move): number {
    return target.getHpRatio() > 0.5 ? Math.floor((target.getHpRatio() - 0.5) * -24 + 4) : -20;
  }
}
