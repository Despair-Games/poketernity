import { Stat } from "#enums/stat";
import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { HitResult } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import type { BattleStat } from "#enums/stat";
import { PostDefendAbAttr } from "./post-defend-ab-attr";

/**
 * Attribute that prompts a stat stage change after the ability holder received a critical hit
 * Abilities using this attribute are:
 * - Anger Point
 */
export class PostDefendCritStatStageChangeAbAttr extends PostDefendAbAttr {
  private readonly stat: BattleStat;
  private readonly stages: number;

  constructor(stat: BattleStat, stages: number) {
    super();

    this.stat = stat;
    this.stages = stages;
  }

  override applyPostDefend(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    attacker: Pokemon,
    _move: Move,
    _hitResult: HitResult,
    _args: any[],
  ): boolean {
    if (
      pokemon.turnData.attacksReceived.length !== 0
      && pokemon.turnData.attacksReceived.some((p) => p.isCritical && p.sourceId === attacker.id)
      && pokemon.summonData.statStages[Stat.ATK] < 6
    ) {
      if (!simulated) {
        globalScene.unshiftPhase(new StatStageChangePhase(pokemon.getBattlerIndex(), true, [this.stat], this.stages));
      }
      return true;
    } else {
      return false;
    }
  }
}
