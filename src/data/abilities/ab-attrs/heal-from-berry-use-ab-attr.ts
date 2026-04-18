import { AbAttr } from "#abilities/ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";
import { clamp, toDmgValue } from "#utils/common-utils";
import i18next from "i18next";

/**
 * A Pokemon with this ability heals by a percentage of their maximum hp after eating a berry
 * @param healPercent - Percent of Max HP to heal
 */
export class HealFromBerryUseAbAttr extends AbAttr {
  protected override readonly abAttrKey = "HealFromBerryUseAbAttr";

  /** Percent of Max HP to heal */
  private readonly healRatio: number;

  constructor(healRatio: number) {
    super(true);

    this.healRatio = clamp(healRatio, 0, 1);
  }

  public override apply({ pokemon, simulated }: BaseAbAttrParams): void {
    if (simulated) {
      return;
    }

    const abilityName = this.source.name;
    globalScene.phaseManager.createAndUnshiftPhase(
      "PokemonHealPhase",
      pokemon.getBattlerIndex(),
      toDmgValue(pokemon.getMaxHp() * this.healRatio),
      {
        message: i18next.t("abilityTriggers:healFromBerryUse", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          abilityName,
        }),
      },
    );
  }
}
