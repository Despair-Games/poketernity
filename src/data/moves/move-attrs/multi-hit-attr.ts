import type { MaxMultiHitAbAttr } from "#app/data/abilities/ab-attrs/max-multi-hit-ab-attr";
import { applyAbAttrs } from "#app/data/abilities/apply-ab-attrs";
import { type Move } from "#app/data/moves/move";
import { ChangeMultiHitTypeAttr } from "#app/data/moves/move-attrs/change-multi-hit-type-attr";
import { MoveAttr } from "#app/data/moves/move-attrs/move-attr";
import type { Pokemon } from "#app/field/pokemon";
import { NumberHolder } from "#app/utils";
import { applyMoveAttrs } from "#app/utils/move-utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { MultiHitType } from "#enums/multi-hit-type";

/**
 * Attribute used for attack moves that hit multiple times per use, e.g. Bullet Seed.
 * Applied at the beginning of {@linkcode MoveEffectPhase}.
 * @extends MoveAttr
 */
export class MultiHitAttr extends MoveAttr {
  /** This move's intrinsic multi-hit type. It should never be modified. */
  private readonly intrinsicMultiHitType: MultiHitType;
  /** This move's current multi-hit type. It may be temporarily modified by abilities (e.g., Battle Bond). */
  private multiHitType: MultiHitType;

  constructor(multiHitType?: MultiHitType) {
    super();

    this.intrinsicMultiHitType = multiHitType !== undefined ? multiHitType : MultiHitType._2_TO_5;
    this.multiHitType = this.intrinsicMultiHitType;
  }

  // Currently used by `battle_bond.test.ts`
  getMultiHitType(): MultiHitType {
    return this.multiHitType;
  }

  /**
   * Set the hit count of an attack based on this attribute instance's {@linkcode MultiHitType}.
   * If the target has an immunity to this attack's types, the hit count will always be 1.
   *
   * @param user {@linkcode Pokemon} that used the attack
   * @param target {@linkcode Pokemon} targeted by the attack
   * @param move {@linkcode Move} being used
   * @param hitCount {@linkcode NumberHolder} storing the hit count of the attack
   * @returns True
   */
  override apply(user: Pokemon, target: Pokemon, move: Move, hitCount: NumberHolder): boolean {
    const hitType = new NumberHolder(this.intrinsicMultiHitType);
    applyMoveAttrs(ChangeMultiHitTypeAttr, user, target, move, hitType);
    this.multiHitType = hitType.value;

    hitCount.value = this.getHitCount(user, target);
    return true;
  }

  override getTargetBenefitScore(_user: Pokemon, _target: Pokemon, _move: Move): number {
    return -5;
  }

  /**
   * Calculate the number of hits that an attack should have given this attribute's
   * {@linkcode MultiHitType}.
   *
   * @param user {@linkcode Pokemon} using the attack
   * @param _target {@linkcode Pokemon} targeted by the attack
   * @returns The number of hits this attack should deal
   */
  getHitCount(user: Pokemon, _target: Pokemon): number {
    switch (this.multiHitType) {
      case MultiHitType._2_TO_5: {
        /**
         * ```
         * | Hits | RNG rolls | Chance | %  |
         * |------|-----------|--------|----|
         * | 2    | 13-19     | 7/20   | 35 |
         * | 3    | 6-12      | 7/20   | 35 |
         * | 4    | 3-5       | 3/20   | 15 |
         * | 5    | 0-2       | 3/20   | 15 |
         * ```
         */
        const rand = user.randSeedInt(20);
        const hitValue = new NumberHolder(rand);
        applyAbAttrs<MaxMultiHitAbAttr>(AbAttrFlag.MAX_MULTI_HIT, user, false, hitValue);
        if (hitValue.value >= 13) {
          return 2;
        } else if (hitValue.value >= 6) {
          return 3;
        } else if (hitValue.value >= 3) {
          return 4;
        } else {
          return 5;
        }
      }
      case MultiHitType._2:
        return 2;
      case MultiHitType._3:
        return 3;
      case MultiHitType._10:
        return 10;
      case MultiHitType.BEAT_UP:
        const party = user.getParty();
        // No status means the ally pokemon can contribute to Beat Up
        return party.reduce((total, pokemon) => {
          return total + (pokemon.id === user.id ? 1 : pokemon.getStatusEffect(true) ? 0 : 1);
        }, 0);
    }
  }
}
