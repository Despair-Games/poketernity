import type { BattleStat } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import { PostBattleInitAbAttr } from "./post-battle-init-ab-attr";

export class PostBattleInitStatStageChangeAbAttr extends PostBattleInitAbAttr {
  private readonly stats: BattleStat[];
  private readonly stages: number;
  private readonly selfTarget: boolean;

  constructor(stats: BattleStat[], stages: number, selfTarget: boolean = false) {
    super(true, true);

    this.stats = stats;
    this.stages = stages;
    this.selfTarget = selfTarget;
  }

  override apply(pokemon: Pokemon, simulated: boolean): boolean {
    const statStageChangePhases: StatStageChangePhase[] = [];

    if (!simulated) {
      if (this.selfTarget) {
        statStageChangePhases.push(
          new StatStageChangePhase(pokemon.getBattlerIndex(), pokemon, this.stats, this.stages),
        );
      } else {
        for (const opponent of pokemon.getOpponents()) {
          statStageChangePhases.push(
            new StatStageChangePhase(opponent.getBattlerIndex(), pokemon, this.stats, this.stages),
          );
        }
      }

      for (const statStageChangePhase of statStageChangePhases) {
        if (!this.selfTarget && !statStageChangePhase.getPokemon()?.summonData) {
          globalScene.pushPhase(statStageChangePhase);
        } else {
          globalScene.unshiftPhase(statStageChangePhase);
        }
      }
    }

    return true;
  }
}
