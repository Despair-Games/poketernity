import { AbAttr } from "#abilities/ab-attr";

/** Attribute for abilities that allow moves that make contact to ignore protection (i.e. Unseen Fist) */
export class IgnoreProtectOnContactAbAttr extends AbAttr {
  protected override readonly abAttrKey = "IgnoreProtectOnContactAbAttr";
}
