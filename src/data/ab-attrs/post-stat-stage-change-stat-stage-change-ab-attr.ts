import type { PokemonStatStageChangeCondition } from "#app/@types/PokemonStatStageChangeCondition";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import type { BattleStat } from "#enums/stat";
import { PostStatStageChangeAbAttr } from "./post-stat-stage-change-ab-attr";

export class PostStatStageChangeStatStageChangeAbAttr extends PostStatStageChangeAbAttr {
  private readonly condition: PokemonStatStageChangeCondition;
  private readonly statsToChange: BattleStat[];
  private readonly stages: number;

  constructor(condition: PokemonStatStageChangeCondition, statsToChange: BattleStat[], stages: number) {
    super(true);

    this.condition = condition;
    this.statsToChange = statsToChange;
    this.stages = stages;
  }

  override applyPostStatStageChange(
    pokemon: Pokemon,
    simulated: boolean,
    statStagesChanged: BattleStat[],
    stagesChanged: number,
    selfTarget: boolean,
    _args: any[],
  ): boolean {
    if (this.condition(pokemon, statStagesChanged, stagesChanged) && !selfTarget) {
      if (!simulated) {
        globalScene.unshiftPhase(
          new StatStageChangePhase(pokemon.getBattlerIndex(), true, this.statsToChange, this.stages),
        );
      }
      return true;
    }

    return false;
  }
}
