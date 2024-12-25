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
   * Adds BattlerTagType from GulpMissileTag based on the Pokemon's HP ratio.
   * @param user The Pokemon using the move.
   * @param _target N/A
   * @param move The move being used.
   * @param _args N/A
   * @returns Whether the BattlerTag is applied.
   */
  override apply(user: Pokemon, _target: Pokemon, move: Move, _args: any[]): boolean {
    if (!super.apply(user, _target, move, _args)) {
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
