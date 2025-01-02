import { ConsecutiveUsePowerMultiplierAttr } from "#app/data/move-attrs/consecutive-use-power-multiplier-attr";

/**
 * Attribute to multiply move power by 2 for each time the
 * move has been used consecutively and successfully.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Rollout_(move) Rollout},
 * {@link https://bulbapedia.bulbagarden.net/wiki/Ice_Ball_(move) Ice Ball},
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Fury_Cutter_(move) Fury Cutter}.
 * @extends ConsecutiveUsePowerMultiplierAttr
 */
export class ConsecutiveUseDoublePowerAttr extends ConsecutiveUsePowerMultiplierAttr {
  getMultiplier(count: number): number {
    return Math.pow(2, count);
  }
}
