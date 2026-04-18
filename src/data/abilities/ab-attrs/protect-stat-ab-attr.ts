import { PreStatStageChangeAbAttr } from "#abilities/pre-stat-stage-change-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BattleStat } from "#enums/stat";
import type { PreStatStageChangeAbAttrParams } from "#types/ab-attr-param-types";
import { getStatKey } from "#utils/i18n-utils";
import i18next from "i18next";

/**
 * Protect one or all {@linkcode BattleStat}s from reductions caused by other Pokémon's moves and Abilities
 */
export class ProtectStatAbAttr extends PreStatStageChangeAbAttr {
  protected override readonly abAttrKey = "ProtectStatAbAttr";

  /** {@linkcode BattleStat} to protect or `undefined` if **all** `BattleStat`s are protected */
  private readonly protectedStat?: BattleStat;

  constructor(protectedStat?: BattleStat) {
    super(true);

    this.protectedStat = protectedStat;
  }

  public override apply({ cancelled }: PreStatStageChangeAbAttrParams): void {
    cancelled.value = true;
  }

  public override canApply({ stat }: Parameters<this["apply"]>[0]): boolean {
    return this.protectedStat == null || stat === this.protectedStat;
  }

  public override getTriggerMessage({ pokemon }: Parameters<this["apply"]>[0], abilityName: string): string {
    return i18next.t("abilityTriggers:protectStat", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
      statName: this.protectedStat ? i18next.t(getStatKey(this.protectedStat)) : i18next.t("battle:stats"),
    });
  }
}
