import { PreStatStageChangeAbAttr } from "#abilities/pre-stat-stage-change-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { BattleStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";
import { getStatKey } from "#utils/i18n-utils";
import i18next from "i18next";

/**
 * Protect one or all {@linkcode BattleStat} from reductions caused by other Pokémon's moves and Abilities
 */
export class ProtectStatAbAttr extends PreStatStageChangeAbAttr {
  /** {@linkcode BattleStat} to protect or `undefined` if **all** {@linkcode BattleStat} are protected */
  private readonly protectedStat?: BattleStat;

  constructor(protectedStat?: BattleStat) {
    super(true);
    this._flags.add(AbAttrFlag.PROTECT_STAT);

    this.protectedStat = protectedStat;
  }

  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _stat: BattleStat,
    cancelled: ValueHolder<boolean>,
  ): void {
    cancelled.value = true;
  }

  public override canApply(...[, , stat]: Parameters<this["apply"]>): boolean {
    return this.protectedStat == null || stat === this.protectedStat;
  }

  public override getTriggerMessage(pokemon: Pokemon, abilityName: string, ..._args: any[]): string {
    return i18next.t("abilityTriggers:protectStat", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
      statName: this.protectedStat ? i18next.t(getStatKey(this.protectedStat)) : i18next.t("battle:stats"),
    });
  }
}
