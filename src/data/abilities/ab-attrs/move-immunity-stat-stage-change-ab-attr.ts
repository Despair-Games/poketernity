import type { PreDefendAbAttrCondition } from "#app/@types/PreDefendAbAttrCondition";
import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import type { BooleanHolder } from "#app/utils";
import type { BattleStat } from "#enums/stat";
import { MoveImmunityAbAttr } from "./move-immunity-ab-attr";

export class MoveImmunityStatStageChangeAbAttr extends MoveImmunityAbAttr {
  private readonly stat: BattleStat;
  private readonly stages: number;

  constructor(immuneCondition: PreDefendAbAttrCondition, stat: BattleStat, stages: number) {
    super(immuneCondition);
    this.stat = stat;
    this.stages = stages;
  }

  override apply(
    pokemon: Pokemon,
    simulated: boolean,
    attacker: Pokemon,
    move: Move,
    cancelled: BooleanHolder,
  ): boolean {
    const ret = super.apply(pokemon, simulated, attacker, move, cancelled);
    if (ret && !simulated) {
      globalScene.phaseManager.unshiftPhase(
        new StatStageChangePhase(pokemon.getBattlerIndex(), pokemon, [this.stat], this.stages),
      );
    }

    return ret;
  }
}
