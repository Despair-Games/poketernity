import type Pokemon from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import type { BooleanHolder } from "#app/utils";
import type { BattleStat } from "#enums/stat";
import { AbAttr } from "./ab-attr";

export class PostIntimidateStatStageChangeAbAttr extends AbAttr {
  private stats: BattleStat[];
  private stages: number;
  private overwrites: boolean;

  constructor(stats: BattleStat[], stages: number, overwrites?: boolean) {
    super(true);
    this.stats = stats;
    this.stages = stages;
    this.overwrites = !!overwrites;
  }

  override apply(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    cancelled: BooleanHolder,
    _args: any[],
  ): boolean {
    if (!simulated) {
      globalScene.pushPhase(new StatStageChangePhase(pokemon.getBattlerIndex(), false, this.stats, this.stages));
    }
    cancelled.value = this.overwrites;
    return true;
  }
}
