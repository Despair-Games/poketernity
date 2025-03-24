import { AbilityId } from "#enums/ability-id";
import { BattlerTagType } from "#enums/battler-tag-type";
import { SpeciesId } from "#enums/species-id";
import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/moves/move";
import { MoveEffectAttr } from "#app/data/moves/move-attrs/move-effect-attr";
import { GulpMissileBattlerTagTypes } from "#app/utils/battler-tag-type-utils";

/**
 * Adds the appropriate battler tag for Gulp Missile when Surf or Dive is used.
 * @extends MoveEffectAttr
 */
export class GulpMissileTagAttr extends MoveEffectAttr {
  constructor() {
    super(true);
  }

  /**
   * If the user is a {@linkcode SpeciesId.CRAMORANT | Cramorant} with {@linkcode AbilityId.GULP_MISSILE | Gulp Missile},
   * allows the user to swallow a {@linkcode BattlerTagType.GULP_MISSILE_ARROKUDA | Arrokuda} or
   * {@linkcode BattlerTagType.GULP_MISSILE_PIKACHU | Pikachu} depending on the user's HP ratio
   */
  override applyEffect(user: Pokemon, _target: Pokemon, move: Move): boolean {
    if (user.hasAbility(AbilityId.GULP_MISSILE) && user.species.speciesId === SpeciesId.CRAMORANT) {
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
    const isCramorant = user.hasAbility(AbilityId.GULP_MISSILE) && user.species.speciesId === SpeciesId.CRAMORANT;
    return isCramorant && !user.getTag(...GulpMissileBattlerTagTypes) ? 10 : 0;
  }
}
