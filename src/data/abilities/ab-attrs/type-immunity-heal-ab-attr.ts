import { TypeImmunityAbAttr } from "#abilities/type-immunity-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { TypeImmunityAbAttrParams } from "#types/ab-attr-param-types";
import { toDmgValue } from "#utils/common-utils";
import i18next from "i18next";

export class TypeImmunityHealAbAttr extends TypeImmunityAbAttr {
  public override apply(params: TypeImmunityAbAttrParams): void {
    super.apply(params);

    const { pokemon, simulated } = params;
    if (pokemon.isFullHp() || simulated) {
      return;
    }

    const abilityName = this.source.name;
    globalScene.phaseManager.createAndUnshiftPhase(
      "PokemonHealPhase",
      pokemon.getBattlerIndex(),
      toDmgValue(pokemon.getMaxHp() / 4),
      {
        message: i18next.t("abilityTriggers:typeImmunityHeal", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          abilityName,
        }),
      },
    );
  }

  // The healing effect from this attribute takes the place of the trigger message if it can be applied
  public override getTriggerMessage(params: Parameters<this["apply"]>[0], abilityName: string): string | null {
    const { pokemon } = params;
    return pokemon.isFullHp() ? super.getTriggerMessage(params, abilityName) : null;
  }
}
