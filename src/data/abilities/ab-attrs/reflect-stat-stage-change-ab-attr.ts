import { AbAttr } from "#abilities/ab-attr";
import { globalScene } from "#app/global-scene";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { BattleStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import type { BooleanHolder } from "#utils/common-utils";

/**
 * Attribute to reflect stat-lowering effects from moves and abilities
 * back to their source.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Mirror_Armor_(Ability) | Mirror Armor}.
 */
export class ReflectStatStageChangeAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
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
   * @returns `true` if a stat stage change is successfully reflected
   */
  public override apply(
    pokemon: Pokemon,
    simulated: boolean,
    source: Pokemon | undefined,
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
    return true;
  }
}
