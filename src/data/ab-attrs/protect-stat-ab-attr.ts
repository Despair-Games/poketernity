import type Pokemon from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import { isNullOrUndefined, type BooleanHolder } from "#app/utils";
import { getStatKey, type BattleStat } from "#enums/stat";
import i18next from "i18next";
import { PreStatStageChangeAbAttr } from "./pre-stat-stage-change-ab-attr";

/**
 * Protect one or all {@linkcode BattleStat} from reductions caused by other Pokémon's moves and Abilities
 * @extends PreStatStageChangeAbAttr
 */
export class ProtectStatAbAttr extends PreStatStageChangeAbAttr {
  /** {@linkcode BattleStat} to protect or `undefined` if **all** {@linkcode BattleStat} are protected */
  private protectedStat?: BattleStat;

  constructor(protectedStat?: BattleStat) {
    super();

    this.protectedStat = protectedStat;
  }

  /**
   * Apply the {@linkcode ProtectedStatAbAttr} to an interaction
   * @param _pokemon
   * @param _passive
   * @param simulated
   * @param stat the {@linkcode BattleStat} being affected
   * @param cancelled The {@linkcode BooleanHolder} that will be set to true if the stat is protected
   * @param _args
   * @returns true if the stat is protected, false otherwise
   */
  override applyPreStatStageChange(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    stat: BattleStat,
    cancelled: BooleanHolder,
    _args: any[],
  ): boolean {
    if (isNullOrUndefined(this.protectedStat) || stat === this.protectedStat) {
      cancelled.value = true;
      return true;
    }

    return false;
  }

  override getTriggerMessage(pokemon: Pokemon, abilityName: string, ..._args: any[]): string {
    return i18next.t("abilityTriggers:protectStat", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
      statName: this.protectedStat ? i18next.t(getStatKey(this.protectedStat)) : i18next.t("battle:stats"),
    });
  }
}
