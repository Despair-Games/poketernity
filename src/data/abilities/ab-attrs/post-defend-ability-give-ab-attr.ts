import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import type { AbilityId } from "#enums/ability-id";
import { MoveFlags } from "#enums/move-flags";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { AbAttrKey, AbAttrMap } from "#types/ability-types";
import i18next from "i18next";

export class PostDefendAbilityGiveAbAttr extends PostDefendAbAttr {
  protected override readonly abAttrKey = "PostDefendAbilityGiveAbAttr";
  private readonly ability: AbilityId;

  constructor(ability: AbilityId) {
    super();
    this.ability = ability;
  }

  public override is<K extends AbAttrKey>(abAttrKey: K): this is AbAttrMap[K] {
    return abAttrKey === this.abAttrKey || abAttrKey === "PostDefendAbAttr";
  }

  public override apply(_pokemon: Pokemon, simulated: boolean, attacker: Pokemon, _move: Move): void {
    if (!simulated) {
      attacker.summonData.ability = this.ability;
      attacker.waveData.abilitiesRevealed.push(this.ability);
    }
  }

  public override canApply(...[pokemon, , attacker, move]: Parameters<this["apply"]>): boolean {
    const ability = attacker.getAbility();
    return (
      move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon)
      && ability.isSuppressable
      && !ability.hasAttr("PostDefendAbilityGiveAbAttr")
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
