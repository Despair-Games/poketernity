import type Pokemon from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { randSeedItem } from "#app/utils";
import { Abilities } from "#enums/abilities";
import i18next from "i18next";
import { UncopiableAbilityAbAttr, allAbilities } from "../ability";
import { setAbilityRevealed } from "./ability-utils";
import { PostSummonAbAttr } from "./post-summon-ab-attr";

/** Attempts to copy a pokemon's ability */
export class PostSummonCopyAbilityAbAttr extends PostSummonAbAttr {
  private target: Pokemon;
  private targetAbilityName: string;

  override applyPostSummon(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    const targets = pokemon.getOpponents();
    if (!targets.length) {
      return false;
    }

    let target: Pokemon;
    if (targets.length > 1) {
      globalScene.executeWithSeedOffset(() => (target = randSeedItem(targets)), globalScene.currentBattle.waveIndex);
    } else {
      target = targets[0];
    }

    if (
      target!.getAbility().hasAttr(UncopiableAbilityAbAttr)
      // Wonder Guard is normally uncopiable so has the attribute, but Trace specifically can copy it
      && !(pokemon.hasAbility(Abilities.TRACE) && target!.getAbility().id === Abilities.WONDER_GUARD)
    ) {
      return false;
    }

    if (!simulated) {
      this.target = target!;
      this.targetAbilityName = allAbilities[target!.getAbility().id].name;
      pokemon.summonData.ability = target!.getAbility().id;
      setAbilityRevealed(target!);
      pokemon.updateInfo();
    }

    return true;
  }

  override getTriggerMessage(pokemon: Pokemon, _abilityName: string, ..._args: any[]): string {
    return i18next.t("abilityTriggers:trace", {
      pokemonName: getPokemonNameWithAffix(pokemon),
      targetName: getPokemonNameWithAffix(this.target),
      abilityName: this.targetAbilityName,
    });
  }
}
