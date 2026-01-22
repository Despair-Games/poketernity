import { PreDefendAbAttr } from "#abilities/pre-defend-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import type { MoveImmunityAbAttrParams } from "#types/ab-attr-param-types";
import type { PreDefendAbAttrCondition } from "#types/ability-types";
import i18next from "i18next";

export class MoveImmunityAbAttr extends PreDefendAbAttr {
  protected override readonly abAttrKey = "MoveImmunityAbAttr";

  private readonly immuneCondition: PreDefendAbAttrCondition;

  constructor(immuneCondition: PreDefendAbAttrCondition) {
    super(true);

    this.immuneCondition = immuneCondition;
  }

  public override apply({ cancelled }: MoveImmunityAbAttrParams): void {
    cancelled.value = true;
  }

  public override canApply({ pokemon, attacker, move }: Parameters<this["apply"]>[0]): boolean {
    return this.immuneCondition(pokemon, attacker, move);
  }

  public override getTriggerMessage({ pokemon }: Parameters<this["apply"]>[0], _abilityName: string): string {
    return i18next.t("abilityTriggers:moveImmunity", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) });
  }
}
