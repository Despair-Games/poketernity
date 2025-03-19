import { MoveLockTag } from "#app/data/battler-tags/move-lock-tag";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { MoveId } from "#enums/move-id";

/**
 * Tag that applies the move-locking effect of {@link https://bulbapedia.bulbagarden.net/wiki/Rollout_(move) | Rollout}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Ice_Ball_(move) Ice Ball}.
 * Also defines a power multiplier for the respective move based on
 * the tag's {@linkcode turnCount}.
 * @extends MoveLockTag
 */
export class RollingTag extends MoveLockTag {
  constructor(sourceMoveId: MoveId) {
    super(BattlerTagType.ROLLING, 5, sourceMoveId);
  }

  public get powerMultiplier() {
    return Math.pow(2, 5 - this.turnCount);
  }
}
