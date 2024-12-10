import type Pokemon from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import { UncopiableAbilityAbAttr, allAbilities } from "../ability";
import { PostKnockOutAbAttr } from "./post-knock-out-ab-attr";

export class CopyFaintedAllyAbilityAbAttr extends PostKnockOutAbAttr {
  constructor() {
    super();
  }

  override applyPostKnockOut(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    knockedOut: Pokemon,
    _args: any[],
  ): boolean {
    if (pokemon.isPlayer() === knockedOut.isPlayer() && !knockedOut.getAbility().hasAttr(UncopiableAbilityAbAttr)) {
      if (!simulated) {
        pokemon.summonData.ability = knockedOut.getAbility().id;
        globalScene.queueMessage(
          i18next.t("abilityTriggers:copyFaintedAllyAbility", {
            pokemonNameWithAffix: getPokemonNameWithAffix(knockedOut),
            abilityName: allAbilities[knockedOut.getAbility().id].name,
          }),
        );
      }
      return true;
    }

    return false;
  }
}
