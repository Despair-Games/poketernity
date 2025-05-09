import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { MoveFlags } from "#enums/move-flags";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import i18next from "i18next";

export class PostDefendAbilitySwapAbAttr extends PostDefendAbAttr {
  override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, move: Move): boolean {
    if (
      move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon)
      && !attacker.getAbility().hasAttrFlag(AbAttrFlag.UNSWAPPABLE_ABILITY)
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

  override getTriggerMessage(pokemon: Pokemon, _abilityName: string, ..._args: any[]): string {
    return i18next.t("abilityTriggers:postDefendAbilitySwap", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
    });
  }
}
