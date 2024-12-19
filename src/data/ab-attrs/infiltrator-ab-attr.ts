import type { Pokemon } from "#app/field/pokemon";
import { BooleanHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";

/**
 * Attribute implementing the effects of {@link https://bulbapedia.bulbagarden.net/wiki/Infiltrator_(Ability) | Infiltrator}.
 * Allows the source's moves to bypass the effects of opposing Light Screen, Reflect, Aurora Veil, Safeguard, Mist, and Substitute.
 */
export class InfiltratorAbAttr extends AbAttr {
  /**
   * Sets a flag to bypass screens, Substitute, Safeguard, and Mist
   * @param _pokemon n/a
   * @param _passive n/a
   * @param _simulated n/a
   * @param _cancelled n/a
   * @param args `[0]` a {@linkcode BooleanHolder | BooleanHolder} containing the flag
   * @returns `true` if the bypass flag was successfully set; `false` otherwise.
   */
  override apply(_pokemon: Pokemon, _passive: boolean, _simulated: boolean, _cancelled: null, args: any[]): boolean {
    const bypassed = args[0];
    if (args[0] instanceof BooleanHolder) {
      bypassed.value = true;
      return true;
    }
    return false;
  }
}
