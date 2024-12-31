import type { BattleStat } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";
import { StatStageChangeAttr } from "#app/data/move-attrs/stat-stage-change-attr";
import type { MoveConditionFunc } from "../move-conditions";

export class PostVictoryStatStageChangeAttr extends MoveAttr {
  private stats: BattleStat[];
  private stages: number;
  private condition?: MoveConditionFunc;
  private showMessage: boolean;

  constructor(
    stats: BattleStat[],
    stages: number,
    _selfTarget?: boolean,
    condition?: MoveConditionFunc,
    showMessage: boolean = true,
    _firstHitOnly: boolean = false,
  ) {
    super();
    this.stats = stats;
    this.stages = stages;
    this.condition = condition;
    this.showMessage = showMessage;
  }

  applyPostVictory(user: Pokemon, target: Pokemon, move: Move): void {
    if (this.condition && !this.condition(user, target, move)) {
      return;
    }
    const statChangeAttr = new StatStageChangeAttr(this.stats, this.stages, this.showMessage);
    statChangeAttr.apply(user, target, move);
  }
}
