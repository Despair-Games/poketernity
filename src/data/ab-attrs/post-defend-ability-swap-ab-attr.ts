import type { Move } from "#app/data/move";
import { MoveFlags } from "#enums/move-flags";
import type { Pokemon } from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import { PostDefendAbAttr } from "./post-defend-ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";

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
        attacker.battleData.abilitiesRevealed.push(sourceAbilityId);

        pokemon.summonData.ability = attackerAbilityId;
        pokemon.battleData.abilitiesRevealed.push(attackerAbilityId);
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
