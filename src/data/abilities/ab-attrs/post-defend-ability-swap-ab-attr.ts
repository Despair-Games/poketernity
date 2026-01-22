import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { MoveFlags } from "#enums/move-flags";
import type { PostDefendAbAttrParams } from "#types/ab-attr-param-types";
import i18next from "i18next";

export class PostDefendAbilitySwapAbAttr extends PostDefendAbAttr {
  public override apply({ pokemon, simulated, attacker }: PostDefendAbAttrParams): void {
    if (simulated) {
      return;
    }

    const sourceAbilityId = pokemon.getAbility().id;
    const attackerAbilityId = attacker.getAbility().id;

    attacker.summonData.ability = sourceAbilityId;
    attacker.waveData.abilitiesRevealed.add(sourceAbilityId);

    pokemon.summonData.ability = attackerAbilityId;
    pokemon.waveData.abilitiesRevealed.add(attackerAbilityId);
  }

  public override canApply({ pokemon, attacker, move }: Parameters<this["apply"]>[0]): boolean {
    return (
      move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon) && attacker.getAbility().swappable && !attacker.isMax()
    );
  }

  public override getTriggerMessage({ pokemon }: Parameters<this["apply"]>[0], _abilityName: string): string {
    return i18next.t("abilityTriggers:postDefendAbilitySwap", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
    });
  }
}
