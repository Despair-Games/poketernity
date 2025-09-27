import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";

export abstract class PostBiomeChangeAbAttr extends AbAttr {
  constructor() {
    super(true);
    this._flags.add(AbAttrFlag.POST_BIOME_CHANGE);
  }

  public abstract override apply(_pokemon: Pokemon, _simulated: boolean): void;
}
