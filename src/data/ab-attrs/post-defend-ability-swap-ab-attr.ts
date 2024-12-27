import type { Move } from "#app/data/move";
import { MoveFlags } from "../../enums/move-flags";
import type { Pokemon } from "#app/field/pokemon";
import type { HitResult } from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import { PostDefendAbAttr } from "./post-defend-ab-attr";
import { UnswappableAbilityAbAttr } from "./unswappable-ability-ab-attr";

export class PostDefendAbilitySwapAbAttr extends PostDefendAbAttr {
  override applyPostDefend(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    attacker: Pokemon,
    move: Move,
    _hitResult: HitResult,
    _args: any[],
  ): boolean {
    if (
      move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon)
      && !attacker.getAbility().hasAttr(UnswappableAbilityAbAttr)
    ) {
      if (!simulated) {
        const tempAbilityId = attacker.getAbility().id;
        attacker.summonData.ability = pokemon.getAbility().id;
        pokemon.summonData.ability = tempAbilityId;
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
