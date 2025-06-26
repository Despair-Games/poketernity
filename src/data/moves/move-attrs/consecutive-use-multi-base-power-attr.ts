import { ConsecutiveUsePowerMultiplierAttr } from "#moves/consecutive-use-power-multiplier-attr";

/**
 * Attribute to scale move power linearly by the amount of times
 * the move has been used consecutively and successfully by the user.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Echoed_Voice_(move) | Echoed Voice}.
 */
export class ConsecutiveUseMultiBasePowerAttr extends ConsecutiveUsePowerMultiplierAttr {
  getMultiplier(count: number): number {
    return count + 1;
  }
}
