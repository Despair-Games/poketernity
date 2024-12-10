import type { AbAttrCondition } from "#app/@types/AbAttrCondition";
import type Pokemon from "#app/field/pokemon";
import type { HitResult } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import type { BattleStat } from "#enums/stat";
import type Move from "../move";
import { PostDefendAbAttr } from "./post-defend-ab-attr";

export class PostDefendCritStatStageChangeAbAttr extends PostDefendAbAttr {
  private stat: BattleStat;
  private stages: number;

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
    move: Move,
    _hitResult: HitResult,
    _args: any[],
  ): boolean {
    if (move.hitsSubstitute(attacker, pokemon)) {
      return false;
    }

    if (!simulated) {
      globalScene.unshiftPhase(new StatStageChangePhase(pokemon.getBattlerIndex(), true, [this.stat], this.stages));
    }

    return true;
  }

  override getCondition(): AbAttrCondition {
    return (pokemon: Pokemon) =>
      pokemon.turnData.attacksReceived.length !== 0
      && pokemon.turnData.attacksReceived[pokemon.turnData.attacksReceived.length - 1].critical;
  }
}
