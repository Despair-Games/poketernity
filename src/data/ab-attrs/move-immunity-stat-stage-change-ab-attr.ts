import type { PreDefendAbAttrCondition } from "#app/@types/PreDefendAbAttrCondition";
import type Move from "#app/data/move";
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

  override applyPreDefend(
    pokemon: Pokemon,
    passive: boolean,
    simulated: boolean,
    attacker: Pokemon,
    move: Move,
    cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    const ret = super.applyPreDefend(pokemon, passive, simulated, attacker, move, cancelled, args);
    if (ret && !simulated) {
      globalScene.unshiftPhase(new StatStageChangePhase(pokemon.getBattlerIndex(), true, [this.stat], this.stages));
    }

    return ret;
  }
}
