import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { AbilityId } from "#enums/ability-id";
import { MoveFlags } from "#enums/move-flags";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import i18next from "i18next";

export class PostDefendAbilityGiveAbAttr extends PostDefendAbAttr {
  private readonly ability: AbilityId;

  constructor(ability: AbilityId) {
    super();
    this._flags.add(AbAttrFlag.POST_DEFEND_ABILITY_GIVE);
    this.ability = ability;
  }

  public override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, move: Move): boolean {
    if (
      move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon)
      && !attacker.getAbility().hasAttrFlag(AbAttrFlag.UNSUPPRESSABLE_ABILITY)
      && !attacker.getAbility().hasAttrFlag(AbAttrFlag.POST_DEFEND_ABILITY_GIVE)
      && !attacker.isMax()
    ) {
      if (!simulated) {
        attacker.summonData.ability = this.ability;
        attacker.waveData.abilitiesRevealed.push(this.ability);
      }

      return true;
    }

    return false;
  }

  public override getTriggerMessage(pokemon: Pokemon, abilityName: string): string {
    return i18next.t("abilityTriggers:postDefendAbilityGive", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
    });
  }
}
