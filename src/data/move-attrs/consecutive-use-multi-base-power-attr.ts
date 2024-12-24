import { ConsecutiveUsePowerMultiplierAttr } from "#app/data/move-attrs/consecutive-use-power-multiplier-attr";

export class ConsecutiveUseMultiBasePowerAttr extends ConsecutiveUsePowerMultiplierAttr {
  getMultiplier(count: number): number {
    return count + 1;
  }
}
