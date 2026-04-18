import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import type { AbilityId } from "#enums/ability-id";
import { MoveFlags } from "#enums/move-flags";
import type { PostDefendAbAttrParams } from "#types/ab-attr-param-types";
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
    // this allows the `AbAttr` to be applied by `applyAbAttrs("PostDefendAbAttr", ...)`
    // while allowing `.hasAttr("PostDefendAbilityGiveAbAttr")` to work
    return abAttrKey === this.abAttrKey || abAttrKey === "PostDefendAbAttr";
  }

  public override apply({ simulated, attacker }: PostDefendAbAttrParams): void {
    if (!simulated) {
      attacker.summonData.ability = this.ability;
      attacker.waveData.abilitiesRevealed.add(this.ability);
    }
  }

  public override canApply({ pokemon, attacker, move }: Parameters<this["apply"]>[0]): boolean {
    const ability = attacker.getAbility();
    return (
      move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon)
      && ability.suppressable
      && !ability.hasAttr("PostDefendAbilityGiveAbAttr")
      && !attacker.isMax()
    );
  }

  public override getTriggerMessage({ pokemon }: Parameters<this["apply"]>[0], abilityName: string): string {
    return i18next.t("abilityTriggers:postDefendAbilityGive", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
    });
  }
}
