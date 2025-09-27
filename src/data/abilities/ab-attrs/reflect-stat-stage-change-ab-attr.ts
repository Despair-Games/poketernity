import { AbAttr } from "#abilities/ab-attr";
import { globalScene } from "#app/global-scene";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { BattleStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

/**
 * Attribute to reflect stat-lowering effects from moves and abilities
 * back to their source.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Mirror_Armor_(Ability) | Mirror Armor}.
 */
export class ReflectStatStageChangeAbAttr extends AbAttr {
  constructor() {
    super(true);
    this._flags.add(AbAttrFlag.REFLECT_STAT_STAGE_CHANGE);
  }

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
   */
  public override apply(
    pokemon: Pokemon,
    simulated: boolean,
    source: Pokemon | undefined,
    stats: BattleStat[],
    stages: number,
    reflected: ValueHolder<boolean>,
  ): void {
    if (!simulated && source) {
      const reflectedStats = stats.filter((stat) => pokemon.getStatStage(stat) > -6);
      globalScene.phaseManager.createAndUnshiftPhase(
        "StatStageChangePhase",
        source.id,
        pokemon,
        reflectedStats,
        stages,
        { bypassReflect: true },
      );
    }
    reflected.value = true;
  }

  public override canApply(...[pokemon, , source, stats, stages, reflected]: Parameters<this["apply"]>): boolean {
    return (
      pokemon !== source && stages < 0 && stats.some((stat) => pokemon.getStatStage(stat) > -6) && !reflected.value
    );
  }
}
