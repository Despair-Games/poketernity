import { HitResult } from "#enums/hit-result";
import type { BattleStat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { StatStageChangeAttr } from "#moves/stat-stage-change-attr";
import type { MoveConditionFunc } from "#types/move-types";
import { toDmgValue } from "#utils/common-utils";

/**
 * Attribute to grant a stat stage boost to the user
 * at the cost of a portion of the user's maximum HP.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Belly_Drum_(move) | Belly Drum}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Clangorous_Soul_(move) | Clangorous Soul}.
 */
export class CutHpStatStageBoostAttr extends StatStageChangeAttr {
  private readonly cutRatio: number;
  private readonly messageCallback: ((user: Pokemon) => void) | undefined;

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

  override applyEffect(user: Pokemon, target: Pokemon, move: Move): boolean {
    user.damageAndUpdate(toDmgValue(user.getMaxHp() / this.cutRatio), {
      result: HitResult.OTHER,
      ignoreSegments: true,
    });
    user.updateInfo();
    const ret = super.applyEffect(user, target, move);
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
