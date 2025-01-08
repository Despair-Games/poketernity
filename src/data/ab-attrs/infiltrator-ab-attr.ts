import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
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
   * @param bypassed a {@linkcode BooleanHolder} containing the flag
   * @returns `true` if the bypass flag was successfully set; `false` otherwise.
   */
  override apply(_pokemon: Pokemon, _passive: boolean, _simulated: boolean, bypassed: BooleanHolder): boolean {
    bypassed.value = true;
    return true;
  }
}
