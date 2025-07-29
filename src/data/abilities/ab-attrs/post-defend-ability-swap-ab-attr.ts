import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { MoveFlags } from "#enums/move-flags";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import i18next from "i18next";

export class PostDefendAbilitySwapAbAttr extends PostDefendAbAttr {
  public override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, move: Move): boolean {
    if (
      move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon)
      && attacker.getAbility().isSwappable
      && !attacker.isMax()
    ) {
      if (!simulated) {
        const sourceAbilityId = pokemon.getAbility().id;
        const attackerAbilityId = attacker.getAbility().id;

        attacker.summonData.ability = sourceAbilityId;
        attacker.waveData.abilitiesRevealed.push(sourceAbilityId);

        pokemon.summonData.ability = attackerAbilityId;
        pokemon.waveData.abilitiesRevealed.push(attackerAbilityId);
      }
      return true;
    }

    return false;
  }

  public override getTriggerMessage(pokemon: Pokemon, _abilityName: string): string {
    return i18next.t("abilityTriggers:postDefendAbilitySwap", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
    });
  }
}
