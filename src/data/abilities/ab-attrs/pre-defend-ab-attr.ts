import { AbAttr } from "#abilities/ab-attr";
import type { PreDefendAbAttrParams } from "#types/ab-attr-param-types";

export abstract class PreDefendAbAttr extends AbAttr {
  public abstract override apply(params: PreDefendAbAttrParams): void;
}
