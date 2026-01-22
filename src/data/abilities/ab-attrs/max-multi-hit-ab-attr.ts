import { AbAttr } from "#abilities/ab-attr";
import type { MultiHitAttr } from "#moves/multi-hit-attr";
import type { MaxMultiHitAbAttrParams } from "#types/ab-attr-param-types";

export class MaxMultiHitAbAttr extends AbAttr {
  protected override readonly abAttrKey = "MaxMultiHitAbAttr";

  /**
   * A {@linkcode hitValue} in the interval `[0, 2]` yields 5 strikes for 2- to 5-strike moves.
   * This forces `hitValue` to 0 to force the maximum number of strikes.
   * @see {@linkcode MultiHitAttr}
   */
  public override apply({ hitValue }: MaxMultiHitAbAttrParams): void {
    hitValue.value = 0;
  }
}
