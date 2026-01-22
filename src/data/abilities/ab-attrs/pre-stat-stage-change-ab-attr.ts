import { AbAttr } from "#abilities/ab-attr";
import type { PreStatStageChangeAbAttrParams } from "#types/ab-attr-param-types";

export abstract class PreStatStageChangeAbAttr extends AbAttr {
  public abstract override apply(params: PreStatStageChangeAbAttrParams): void;
}
