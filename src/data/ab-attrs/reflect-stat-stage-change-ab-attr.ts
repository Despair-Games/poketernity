import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import type { BooleanHolder } from "#app/utils";
import type { BattleStat } from "#enums/stat";
import { AbAttr } from "./ab-attr";

/**
 * Attribute to reflect stat-lowering effects from moves and abilities
 * back to their source.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Mirror_Armor_(Ability) | Mirror Armor}.
 * @extends AbAttr
 */
export class ReflectStatStageChangeAbAttr extends AbAttr {
  /**
   * If the current {@linkcode StatStageChangePhase} will lower the ability
   * source's stat(s), queue a new phase targeting the effect source
   * with the same stat stage changes.
   * @param pokemon the {@linkcode Pokemon} with this ability
   * @param simulated if `true`, suppresses changes to game state
   * @param source the {@linkcode Pokemon} applying the original stat change
   * @param stats the {@linkcode Stat | stats} being changed
   * @param stages the stages by which {@linkcode stats} will change
   * @param reflected a {@linkcode BooleanHolder} which, if set to `true`, cancels the current
   * stat stage change phase
   * @returns `true` if a stat stage change is successfully reflected
   */
  override apply(
    pokemon: Pokemon,
    simulated: boolean,
    source: Pokemon | null,
    stats: BattleStat[],
    stages: number,
    reflected: BooleanHolder,
  ): boolean {
    if (pokemon === source || stages >= 0) {
      return false;
    }

    const reflectedStats = stats.filter((stat) => pokemon.getStatStage(stat) > -6);
    if (reflectedStats.length === 0) {
      return false;
    }

    if (!simulated && source) {
      globalScene.unshiftPhase(
        new StatStageChangePhase(source.id, pokemon, reflectedStats, stages, { bypassReflect: true }),
      );
    }
    reflected.value = true;
    return true;
  }
}
