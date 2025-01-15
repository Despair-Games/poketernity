import type { Pokemon } from "#app/field/pokemon";
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
  private readonly protectedStat?: BattleStat;

  constructor(protectedStat?: BattleStat) {
    super();

    this.protectedStat = protectedStat;
  }

  override apply(_pokemon: Pokemon, _simulated: boolean, stat: BattleStat, cancelled: BooleanHolder): boolean {
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
