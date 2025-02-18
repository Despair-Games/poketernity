import type { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import type { RollingTag } from "../battler-tags";
import { MovePowerMultiplierAttr } from "./move-power-multiplier-attr";

/**
 * Attribute implementing the power-multiplying properties of
 * {@link https://bulbapedia.bulbagarden.net/wiki/Rollout_(move) | Rollout}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Ice_Ball_(move) | Ice Ball}.
 * Multiplies the move's power by 2 for every turn spent under the move's
 * execution
 * @extends MovePowerMultiplierAttr
 * @see {@linkcode RollingTag}
 */
export class RollingPowerMultiplierAttr extends MovePowerMultiplierAttr {
  constructor(tagType: BattlerTagType) {
    super((user, _target, _move) => {
      const baseMultiplier = user.getTag<RollingTag>(tagType)?.powerMultiplier ?? 1;
      const defenseCurlMultiplier = user.getMoveHistory().some((turnMove) => turnMove.move.id === MoveId.DEFENSE_CURL)
        ? 2
        : 1;

      return baseMultiplier * defenseCurlMultiplier;
    });
  }
}
