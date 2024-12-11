import type { BattleStat } from "#app/enums/stat";
import type Pokemon from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import { PostBattleInitAbAttr } from "./post-battle-init-ab-attr";

export class PostBattleInitStatStageChangeAbAttr extends PostBattleInitAbAttr {
  private stats: BattleStat[];
  private stages: number;
  private selfTarget: boolean;

  constructor(stats: BattleStat[], stages: number, selfTarget?: boolean) {
    super();

    this.stats = stats;
    this.stages = stages;
    this.selfTarget = !!selfTarget;
  }

  override applyPostBattleInit(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    const statStageChangePhases: StatStageChangePhase[] = [];

    if (!simulated) {
      if (this.selfTarget) {
        statStageChangePhases.push(new StatStageChangePhase(pokemon.getBattlerIndex(), true, this.stats, this.stages));
      } else {
        for (const opponent of pokemon.getOpponents()) {
          statStageChangePhases.push(
            new StatStageChangePhase(opponent.getBattlerIndex(), false, this.stats, this.stages),
          );
        }
      }

      for (const statStageChangePhase of statStageChangePhases) {
        if (!this.selfTarget && !statStageChangePhase.getPokemon()?.summonData) {
          globalScene.pushPhase(statStageChangePhase);
        } else {
          // TODO: This causes the ability bar to be shown at the wrong time
          globalScene.unshiftPhase(statStageChangePhase);
        }
      }
    }

    return true;
  }
}
