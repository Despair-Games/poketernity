import { AbAttr } from "#abilities/ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import { clamp, toDmgValue } from "#utils/common-utils";
import i18next from "i18next";

/**
 * A Pokemon with this ability heals by a percentage of their maximum hp after eating a berry
 * @param healPercent - Percent of Max HP to heal
 * @see {@linkcode apply()} for implementation
 */
export class HealFromBerryUseAbAttr extends AbAttr {
  /** Percent of Max HP to heal */
  private readonly healPercent: number;

  constructor(healPercent: number) {
    super();
    this._flags.add(AbAttrFlag.HEAL_FROM_BERRY_USE);

    // Clamp healPercent so its between [0,1].
    this.healPercent = clamp(healPercent, 0, 1);
  }

  public override apply(pokemon: Pokemon, simulated: boolean): boolean {
    const abilityName = this.source.name;
    if (!simulated) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "PokemonHealPhase",
        pokemon.getBattlerIndex(),
        toDmgValue(pokemon.getMaxHp() * this.healPercent),
        {
          message: i18next.t("abilityTriggers:healFromBerryUse", {
            pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
            abilityName,
          }),
        },
      );
    }
    return true;
  }
}
