import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbAttr } from "./ab-attr";

/**
 * Attribute implementing the effects of {@link https://bulbapedia.bulbagarden.net/wiki/Infiltrator_(Ability) | Infiltrator}.
 * Allows the source's moves to bypass the effects of opposing Light Screen, Reflect, Aurora Veil, Safeguard, Mist, and Substitute.
 */
export class InfiltratorAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.INFILTRATOR);
  }

  /**
   * Sets a flag to bypass screens, Substitute, Safeguard, and Mist
   * @param pokemon n/a
   * @param simulated n/a
   * @param bypassed a {@linkcode BooleanHolder} containing the flag
   * @returns `true` if the bypass flag was successfully set; `false` otherwise.
   */
  override apply(_pokemon: Pokemon, _simulated: boolean, bypassed: BooleanHolder): boolean {
    bypassed.value = true;
    return true;
  }
}
