import { PostKnockOutAbAttr } from "#abilities/post-knock-out-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { PostKnockOutAbAttrParams } from "#types/ab-attr-param-types";
import i18next from "i18next";

export class CopyFaintedAllyAbilityAbAttr extends PostKnockOutAbAttr {
  public override apply({ pokemon, simulated, knockedOutPokemon }: PostKnockOutAbAttrParams): void {
    if (simulated) {
      return;
    }

    const { id: abilityId, name: abilityName } = knockedOutPokemon.getAbility();
    pokemon.summonData.ability = abilityId;
    pokemon.waveData.abilitiesRevealed.add(abilityId);
    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("abilityTriggers:copyFaintedAllyAbility", {
        pokemonNameWithAffix: getPokemonNameWithAffix(knockedOutPokemon),
        abilityName,
      }),
    );
  }

  public override canApply({ pokemon, knockedOutPokemon }: Parameters<this["apply"]>[0]): boolean {
    return !pokemon.isOpponent(knockedOutPokemon) && knockedOutPokemon.getAbility().copiable;
  }
}
