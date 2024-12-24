import { ConsecutiveUsePowerMultiplierAttr } from "#app/data/move-attrs/consecutive-use-power-multiplier-attr";

export class ConsecutiveUseDoublePowerAttr extends ConsecutiveUsePowerMultiplierAttr {
  getMultiplier(count: number): number {
    return Math.pow(2, count);
  }
}
