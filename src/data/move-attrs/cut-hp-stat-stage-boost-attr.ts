import type { BattleStat } from "#enums/stat";
import { type Pokemon, HitResult } from "#app/field/pokemon";
import { toDmgValue } from "#app/utils";
import type { Move } from "#app/data/move";
import { StatStageChangeAttr } from "#app/data/move-attrs/stat-stage-change-attr";
import type { MoveConditionFunc } from "../move-conditions";

export class CutHpStatStageBoostAttr extends StatStageChangeAttr {
  private cutRatio: number;
  private messageCallback: ((user: Pokemon) => void) | undefined;

  constructor(
    stat: BattleStat[],
    levels: number,
    cutRatio: number,
    messageCallback?: ((user: Pokemon) => void) | undefined,
  ) {
    super(stat, levels, true);

    this.cutRatio = cutRatio;
    this.messageCallback = messageCallback;
  }

  override apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    user.damageAndUpdate(toDmgValue(user.getMaxHp() / this.cutRatio), HitResult.OTHER, false, true);
    user.updateInfo();
    const ret = super.apply(user, target, move, args);
    if (this.messageCallback) {
      this.messageCallback(user);
    }
    return ret;
  }

  override getCondition(): MoveConditionFunc {
    return (user, _target, _move) =>
      user.getHpRatio() > 1 / this.cutRatio && this.stats.some((s) => user.getStatStage(s) < 6);
  }
}
