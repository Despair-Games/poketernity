import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
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

  public override apply(pokemon: Pokemon, simulated: boolean): void {
    if (!simulated) {
      this.targetAbilityName = allAbilities[this.target.getAbility().id].name;
      pokemon.summonData.ability = this.target.getAbility().id;
      this.target.waveData.abilitiesRevealed.push(this.target.getAbility().id);
      pokemon.updateInfo();
    }
  }

  public override canApply(...[pokemon]: Parameters<this["apply"]>): boolean {
    const targets = pokemon.getOpponents();
    if (targets.length === 0) {
      return false;
    }

    this.target = randSeedItem(targets);
    // Wonder Guard is uncopiable by other effects, but Trace specifically can copy it
    return this.target.getAbility().isCopiable || this.target.getAbility().id === AbilityId.WONDER_GUARD;
  }

  public override getTriggerMessage(pokemon: Pokemon, _abilityName: string): string {
    return i18next.t("abilityTriggers:trace", {
      pokemonName: getPokemonNameWithAffix(pokemon),
      targetName: getPokemonNameWithAffix(this.target),
      abilityName: this.targetAbilityName,
    });
  }
}
