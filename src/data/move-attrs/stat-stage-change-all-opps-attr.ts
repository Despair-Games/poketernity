import { type BattleStat } from "#enums/stat";
import { type Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import type { Move } from "#app/data/move";
import { type MoveEffectAttrOptions, MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";
import type { MoveConditionFunc } from "../move-conditions";

/**
 * Set of optional parameters that may be applied to stat stage changing effects
 * @extends MoveEffectAttrOptions
 * @see {@linkcode StatStageChangeAttr}
 */
interface StatStageChangeAllOppsAttrOptions extends MoveEffectAttrOptions {
  /** If defined, needs to be met in order for the stat change to apply */
  condition?: MoveConditionFunc;
  /** `true` to display a message */
  showMessage?: boolean;
}

/**
 * Attribute used for G-Max moves that change the stats of all opponents
 * ```
 * +-------------+----------+--------+
 * | G-Max Move  |   Stat   | Change |
 * +-------------+----------+--------+
 * | Foam Burst  | Speed    |     -2 |
 * | Tartness    | Evasion  |     -1 |
 * +-------------+----------+--------+
 * ```
 * @param stats {@linkcode BattleStat} Array of stat(s) to change
 * @param stages How many stages to change the stat(s) by, [-6, 6]
 * @param selfTarget `true` if the move is self-targetting
 * @param options {@linkcode StatStageChangeAttrOptions} Container for any optional parameters for this attribute.
 *
 * @extends MoveEffectAttr
 */

export class StatStageChangeAllOppsAttr extends MoveEffectAttr {
  public stats: BattleStat[];
  public stages: number;
  public override options?: StatStageChangeAllOppsAttrOptions;

  constructor(stats: BattleStat[], stages: number, options?: StatStageChangeAllOppsAttrOptions) {
    super(true, options);
    this.stats = stats;
    this.stages = stages;
    this.options = options;
  }

  /**
   * The condition required for the stat stage change to apply.
   * Defaults to `null` (i.e. no condition required).
   */
  private get condition() {
    return this.options?.condition ?? null;
  }

  /**
   * `true` to display a message for the stat change.
   * @default true
   */
  private get showMessage() {
    return this.options?.showMessage ?? true;
  }

  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (this.condition && !this.condition(user, target, move)) {
      return false;
    }

    const moveChance = this.getMoveChance(user, target, move, false, true);
    if (moveChance < 0 || moveChance === 100 || user.randSeedInt(100) < moveChance) {
      let allOpps: Pokemon[];
      if (target.isPlayer()) {
        allOpps = globalScene.getPlayerField();
      } else {
        allOpps = globalScene.getEnemyField();
      }
      allOpps = allOpps.filter((p) => p.isActive(true));
      allOpps.forEach((opp) =>
        globalScene.unshiftPhase(
          new StatStageChangePhase(opp.getBattlerIndex(), false, this.stats, this.stages, {
            showMessage: this.showMessage,
          }),
        ),
      );
      return true;
    }

    return false;
  }

  override getTargetBenefitScore(_user: Pokemon, target: Pokemon, _move: Move): number {
    let ret = 0;
    for (const stat of this.stats) {
      let levels = this.stages;
      const statStage = target.getStatStage(stat);
      if (levels > 0) {
        levels = Math.min(statStage + levels, 6) - statStage;
      } else {
        levels = Math.max(statStage + levels, -6) - statStage;
      }
      ret += levels * 4 + 2;
    }
    return ret;
  }
}
