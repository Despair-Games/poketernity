import { AbAttr } from "#abilities/ab-attr";
import type { PreAttackAbAttrParams } from "#types/ab-attr-param-types";

export abstract class PreAttackAbAttr extends AbAttr {
  public abstract override apply(params: PreAttackAbAttrParams): void;
}
