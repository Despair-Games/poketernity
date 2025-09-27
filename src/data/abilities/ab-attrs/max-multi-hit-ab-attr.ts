/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { MultiHitAttr } from "#moves/multi-hit-attr";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

export class MaxMultiHitAbAttr extends AbAttr {
  constructor() {
    super();
    this._flags.add(AbAttrFlag.MAX_MULTI_HIT);
  }

  /**
   * A {@linkcode hitValue} in the interval `[0, 2]` yields 5 strikes for 2- to 5-strike moves.
   * This forces `hitValue` to 0 to force the maximum number of strikes.
   * @see {@linkcode MultiHitAttr}
   */
  public override apply(_pokemon: Pokemon, _simulated: boolean, hitValue: ValueHolder<number>): void {
    hitValue.value = 0;
  }
}
