import type { Move } from "#app/data/move";
import { MoveFlags } from "#enums/move-flags";
import type { Pokemon } from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import type { Abilities } from "#enums/abilities";
import i18next from "i18next";
import { PostDefendAbAttr } from "./post-defend-ab-attr";
import { UnsuppressableAbilityAbAttr } from "./unsuppressable-ability-ab-attr";

export class PostDefendAbilityGiveAbAttr extends PostDefendAbAttr {
  private readonly ability: Abilities;

  constructor(ability: Abilities) {
    super();
    this.ability = ability;
  }

  override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, move: Move): boolean {
    if (
      move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon)
      && !attacker.getAbility().hasAttr(UnsuppressableAbilityAbAttr)
      && !attacker.getAbility().hasAttr(PostDefendAbilityGiveAbAttr)
      && !attacker.isMax()
    ) {
      if (!simulated) {
        attacker.summonData.ability = this.ability;
        attacker.battleData.abilitiesRevealed.push(this.ability);
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
