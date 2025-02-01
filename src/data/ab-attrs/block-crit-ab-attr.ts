import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";

/**
 * Provides immunity to critical hits
 * These abilities use this attribute:
 * - Battle Armor
 * - Shell Armor (Identical to Battle Armor in functionality, just has a different name)
 * @extends AbAttr
 */
export class BlockCritAbAttr extends AbAttr {
  override apply(_pokemon: Pokemon, _simulated: boolean, isCritical: BooleanHolder): boolean {
    if (isCritical.value) {
      isCritical.value = false;
      return true;
    }
    return false;
  }
}
