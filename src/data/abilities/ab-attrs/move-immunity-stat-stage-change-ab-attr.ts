import { MoveImmunityAbAttr } from "#abilities/move-immunity-ab-attr";
import { globalScene } from "#app/global-scene";
import type { BattleStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { StatStageChangePhase } from "#phases/stat-stage-change-phase";
import type { PreDefendAbAttrCondition } from "#types/pre-defend-ab-attr-condition";
import type { BooleanHolder } from "#utils/common-utils";

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
