import type Pokemon from "#app/field/pokemon";
import type { HitResult } from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import type { Abilities } from "#enums/abilities";
import i18next from "i18next";
import { UnsuppressableAbilityAbAttr } from "../ability";
import type Move from "../move";
import { MoveFlags } from "../move";
import { PostDefendAbAttr } from "./post-defend-ab-attr";

export class PostDefendAbilityGiveAbAttr extends PostDefendAbAttr {
  private ability: Abilities;

  constructor(ability: Abilities) {
    super();
    this.ability = ability;
  }

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
      && !attacker.getAbility().hasAttr(UnsuppressableAbilityAbAttr)
      && !attacker.getAbility().hasAttr(PostDefendAbilityGiveAbAttr)
      && !move.hitsSubstitute(attacker, pokemon)
    ) {
      if (!simulated) {
        attacker.summonData.ability = this.ability;
      }

      return true;
    }

    return false;
  }

  override getTriggerMessage(pokemon: Pokemon, abilityName: string, ..._args: any[]): string {
    return i18next.t("abilityTriggers:postDefendAbilityGive", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
    });
  }
}
