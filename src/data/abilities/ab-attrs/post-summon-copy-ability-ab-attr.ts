import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { allAbilities } from "#data/data-lists";
import { AbilityId } from "#enums/ability-id";
import type { Pokemon } from "#field/pokemon";
import { randSeedItem } from "#utils/random-utils";
import i18next from "i18next";

/**
 * Attempts to copy a pokemon's ability. Used by Trace.
 */
export class PostSummonCopyAbilityAbAttr extends PostSummonAbAttr {
  private target: Pokemon;
  private targetAbilityName: string;

  public override apply(pokemon: Pokemon, simulated: boolean): boolean {
    const targets = pokemon.getOpponents();
    if (!targets.length) {
      return false;
    }

    let target: Pokemon;
    if (targets.length > 1) {
      globalScene.executeWithSeedOffset(() => (target = randSeedItem(targets)), globalScene.currentBattle.waveIndex);
      target = target!;
    } else {
      target = targets[0];
    }

    // Wonder Guard is normally uncopiable so has the attribute, but Trace specifically can copy it
    if (
      !target.getAbility().isCopiable
      && !(pokemon.hasAbility(AbilityId.TRACE) && target.getAbility().id === AbilityId.WONDER_GUARD)
    ) {
      return false;
    }

    if (!simulated) {
      this.target = target;
      this.targetAbilityName = allAbilities[target.getAbility().id].name;
      pokemon.summonData.ability = target.getAbility().id;
      target.waveData.abilitiesRevealed.push(target.getAbility().id);
      pokemon.updateInfo();
    }

    return true;
  }

  public override getTriggerMessage(pokemon: Pokemon, _abilityName: string): string {
    return i18next.t("abilityTriggers:trace", {
      pokemonName: getPokemonNameWithAffix(pokemon),
      targetName: getPokemonNameWithAffix(this.target),
      abilityName: this.targetAbilityName,
    });
  }
}
