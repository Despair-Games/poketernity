import { MoveCategory } from "#enums/move-category";
import { type BattleStat, Stat } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import { AttackMove } from "#app/data/attack-move";
import type { MoveConditionFunc, Move } from "#app/data/move";
import { type MoveEffectAttrOptions, MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Set of optional parameters that may be applied to stat stage changing effects
 * @extends MoveEffectAttrOptions
 * @see {@linkcode StatStageChangeAttr}
 */
interface StatStageChangeAttrOptions extends MoveEffectAttrOptions {
  /** If defined, needs to be met in order for the stat change to apply */
  condition?: MoveConditionFunc;
  /** `true` to display a message */
  showMessage?: boolean;
}
/**
 * Attribute used for moves that change stat stages
 *
 * @param stats {@linkcode BattleStat} Array of stat(s) to change
 * @param stages How many stages to change the stat(s) by, [-6, 6]
 * @param selfTarget `true` if the move is self-targetting
 * @param options {@linkcode StatStageChangeAttrOptions} Container for any optional parameters for this attribute.
 *
 * @extends MoveEffectAttr
 * @see {@linkcode apply}
 */

export class StatStageChangeAttr extends MoveEffectAttr {
  public stats: BattleStat[];
  public stages: number;
  /**
   * Container for optional parameters to this attribute.
   * @see {@linkcode StatStageChangeAttrOptions} for available optional params
   */
  protected override options?: StatStageChangeAttrOptions;

  constructor(stats: BattleStat[], stages: number, selfTarget?: boolean, options?: StatStageChangeAttrOptions) {
    super(selfTarget, options);
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

  /**
   * Attempts to change stats of the user or target (depending on value of selfTarget) if conditions are met
   * @param user {@linkcode Pokemon} the user of the move
   * @param target {@linkcode Pokemon} the target of the move
   * @param move {@linkcode Move} the move
   * @param args unused
   * @returns whether stat stages were changed
   */
  override apply(user: Pokemon, target: Pokemon, move: Move, args?: any[]): boolean {
    if (!super.apply(user, target, move, args) || (this.condition && !this.condition(user, target, move))) {
      return false;
    }

    const moveChance = this.getMoveChance(user, target, move, this.selfTarget, true);
    if (moveChance < 0 || moveChance === 100 || user.randSeedInt(100) < moveChance) {
      const stages = this.getLevels(user);
      globalScene.unshiftPhase(
        new StatStageChangePhase(
          (this.selfTarget ? user : target).getBattlerIndex(),
          this.selfTarget,
          this.stats,
          stages,
          this.showMessage,
        ),
      );
      return true;
    }

    return false;
  }

  getLevels(_user: Pokemon): number {
    return this.stages;
  }

  override getTargetBenefitScore(user: Pokemon, target: Pokemon, _move: Move): number {
    let ret = 0;
    const moveLevels = this.getLevels(user);
    for (const stat of this.stats) {
      let levels = moveLevels;
      const statStage = target.getStatStage(stat);
      if (levels > 0) {
        levels = Math.min(statStage + levels, 6) - statStage;
      } else {
        levels = Math.max(statStage + levels, -6) - statStage;
      }
      let noEffect = false;
      switch (stat) {
        case Stat.ATK:
          if (this.selfTarget) {
            noEffect = !user.getMoveset().find((m) => m instanceof AttackMove && m.category === MoveCategory.PHYSICAL);
          }
          break;
        case Stat.DEF:
          if (!this.selfTarget) {
            noEffect = !user.getMoveset().find((m) => m instanceof AttackMove && m.category === MoveCategory.PHYSICAL);
          }
          break;
        case Stat.SPATK:
          if (this.selfTarget) {
            noEffect = !user.getMoveset().find((m) => m instanceof AttackMove && m.category === MoveCategory.SPECIAL);
          }
          break;
        case Stat.SPDEF:
          if (!this.selfTarget) {
            noEffect = !user.getMoveset().find((m) => m instanceof AttackMove && m.category === MoveCategory.SPECIAL);
          }
          break;
      }
      if (noEffect) {
        continue;
      }
      ret += levels * 4 + (levels > 0 ? -2 : 2);
    }
    return ret;
  }
}
