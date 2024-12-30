import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

/**
 * Attribute used for multi-hit moves that increase power in increments of the
 * move's base power for each hit, namely Triple Kick and Triple Axel.
 * @extends VariablePowerAttr
 */
export class MultiHitPowerIncrementAttr extends VariablePowerAttr {
  /** The max number of base power increments allowed for this move */
  private maxHits: number;

  constructor(maxHits: number) {
    super();

    this.maxHits = maxHits;
  }

  /**
   * Increases power of move in increments of the base power for the amount of times
   * the move hit. In the case that the move is extended, it will circle back to the
   * original base power of the move after incrementing past the maximum amount of
   * hits.
   * @param user {@linkcode Pokemon} that used the move
   * @param _target {@linkcode Pokemon} that the move was used on
   * @param move {@linkcode Move} with this attribute
   * @param power {@linkcode NumberHolder} for final calculated power of move
   * @returns true if attribute application succeeds
   */
  override apply(user: Pokemon, _target: Pokemon, move: Move, power: NumberHolder): boolean {
    const hitsTotal = user.turnData.hitCount - Math.max(user.turnData.hitsLeft, 0);
    power.value = move.power * (1 + (hitsTotal % this.maxHits));
    return true;
  }
}
