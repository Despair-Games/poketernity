import { Abilities } from "#enums/abilities";
import { BattlerTagType } from "#enums/battler-tag-type";
import { Species } from "#enums/species";
import type { Pokemon } from "#app/field/pokemon";
import { GulpMissileTag } from "#app/data/battler-tags";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Adds the appropriate battler tag for Gulp Missile when Surf or Dive is used.
 * @extends MoveEffectAttr
 */
export class GulpMissileTagAttr extends MoveEffectAttr {
  constructor() {
    super(true);
  }

  /**
   * If the user is a {@linkcode Species.CRAMORANT Cramorant} with {@linkcode Abilities.GULP_MISSILE Gulp Missile},
   * allows the user to swallow a {@linkcode BattlerTagType.GULP_MISSILE_ARROKUDA Arrokuda} or
   * {@linkcode BattlerTagType.GULP_MISSILE_PIKACHU Pikachu} depending on the user's HP ratio
   */
  override apply(user: Pokemon, _target: Pokemon, move: Move): boolean {
    if (!super.apply(user, _target, move)) {
      return false;
    }

    if (user.hasAbility(Abilities.GULP_MISSILE) && user.species.speciesId === Species.CRAMORANT) {
      if (user.getHpRatio() >= 0.5) {
        user.addTag(BattlerTagType.GULP_MISSILE_ARROKUDA, 0, move.id);
      } else {
        user.addTag(BattlerTagType.GULP_MISSILE_PIKACHU, 0, move.id);
      }
      return true;
    }

    return false;
  }

  override getUserBenefitScore(user: Pokemon, _target: Pokemon, _move: Move): number {
    const isCramorant = user.hasAbility(Abilities.GULP_MISSILE) && user.species.speciesId === Species.CRAMORANT;
    return isCramorant && !user.getTag(GulpMissileTag) ? 10 : 0;
  }
}
