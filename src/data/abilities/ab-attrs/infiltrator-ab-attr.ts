import { AbAttr } from "#abilities/ab-attr";
import type { InfiltratorAbAttrParams } from "#types/ab-attr-param-types";

/**
 * Allows the source's moves to bypass the effects of opposing Light Screen, Reflect, Aurora Veil, Safeguard, Mist, and Substitute.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Infiltrator_(Ability) | Infiltrator (Bulbapedia)}
 */
export class InfiltratorAbAttr extends AbAttr {
  protected override readonly abAttrKey = "InfiltratorAbAttr";

  public override apply({ bypassed }: InfiltratorAbAttrParams): void {
    bypassed.value = true;
  }
}
