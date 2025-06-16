import { PreStatStageChangeAbAttr } from "#abilities/pre-stat-stage-change-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { getStatKey, type BattleStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import { isNil, type BooleanHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Protect one or all {@linkcode BattleStat} from reductions caused by other Pokémon's moves and Abilities
 */
export class ProtectStatAbAttr extends PreStatStageChangeAbAttr {
  /** {@linkcode BattleStat} to protect or `undefined` if **all** {@linkcode BattleStat} are protected */
  private readonly protectedStat?: BattleStat;

  constructor(protectedStat?: BattleStat) {
    super();
    this._flags.add(AbAttrFlag.PROTECT_STAT);

    this.protectedStat = protectedStat;
  }

  public override apply(_pokemon: Pokemon, _simulated: boolean, stat: BattleStat, cancelled: BooleanHolder): boolean {
    if (isNil(this.protectedStat) || stat === this.protectedStat) {
      cancelled.value = true;
      return true;
    }

    return false;
  }

  public override getTriggerMessage(pokemon: Pokemon, abilityName: string, ..._args: any[]): string {
    return i18next.t("abilityTriggers:protectStat", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
      statName: this.protectedStat ? i18next.t(getStatKey(this.protectedStat)) : i18next.t("battle:stats"),
    });
  }
}
