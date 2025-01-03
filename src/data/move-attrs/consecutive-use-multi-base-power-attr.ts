import { ConsecutiveUsePowerMultiplierAttr } from "#app/data/move-attrs/consecutive-use-power-multiplier-attr";

/**
 * Attribute to scale move power linearly by the amount of times
 * the move has been used consecutively and successfully by the user.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Echoed_Voice_(move) Echoed Voice}.
 * @extends ConsecutiveUsePowerMultiplierAttr
 */
export class ConsecutiveUseMultiBasePowerAttr extends ConsecutiveUsePowerMultiplierAttr {
  getMultiplier(count: number): number {
    return count + 1;
  }
}
