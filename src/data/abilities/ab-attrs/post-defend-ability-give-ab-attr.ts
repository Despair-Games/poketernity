import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import type { AbilityId } from "#enums/ability-id";
import { MoveFlags } from "#enums/move-flags";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import i18next from "i18next";

export class PostDefendAbilityGiveAbAttr extends PostDefendAbAttr {
  private readonly ability: AbilityId;

  constructor(ability: AbilityId) {
    super();
    this.ability = ability;
  }

  public override apply(_pokemon: Pokemon, simulated: boolean, attacker: Pokemon, _move: Move): void {
    if (!simulated) {
      attacker.summonData.ability = this.ability;
      attacker.waveData.abilitiesRevealed.push(this.ability);
    }
  }

  public override canApply(...[pokemon, , attacker, move]: Parameters<this["apply"]>): boolean {
    // TODO: This allows Mummy to affect Lingering Aroma (and vice versa)
    return (
      move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon)
      && attacker.getAbility().isSuppressable
      && attacker.getAbility() !== pokemon.getAbility()
      && !attacker.isMax()
    );
  }

  public override getTriggerMessage(pokemon: Pokemon, abilityName: string): string {
    return i18next.t("abilityTriggers:postDefendAbilityGive", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
    });
  }
}
