import type { BattleStat } from "#enums/stat";
import { type Pokemon, HitResult } from "#app/field/pokemon";
import { toDmgValue } from "#app/utils";
import type { Move } from "#app/data/move";
import { StatStageChangeAttr } from "#app/data/move-attrs/stat-stage-change-attr";
import type { MoveConditionFunc } from "../move-conditions";

/**
 * Attribute to grant a stat stage boost to the user
 * at the cost of a portion of the user's maximum HP.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Belly_Drum_(move) Belly Drum}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Clangorous_Soul_(move) Clangorous Soul}.
 * @extends StatStageChangeAttr
 */
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

  /** Sacrifices a set ratio of the user's maximum HP to grant a stat stage boost */
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    user.damageAndUpdate(toDmgValue(user.getMaxHp() / this.cutRatio), HitResult.OTHER, false, true);
    user.updateInfo();
    const ret = super.apply(user, target, move);
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
