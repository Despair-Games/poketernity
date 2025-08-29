import { BAD_MOVE_PENALTY, KO_ATTACK_SCORE } from "#constants/ai-constants";
import { AbilityId } from "#enums/ability-id";
import type { BattleStat } from "#enums/stat";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveAttr } from "#moves/move-attr";
import { StatStageChangeAttr } from "#moves/stat-stage-change-attr";
import type { MoveConditionFunc } from "#types/move-types";

/**
 * Attribute to increase the user's stats upon knocking out the target with the move.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Fell_Stinger_(move) | Fell Stinger}.
 */
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
    super(true);
    this.stats = stats;
    this.stages = stages;
    this.condition = condition;
    this.showMessage = showMessage;
  }

  /** @todo Override {@linkcode apply} instead */
  public applyPostVictory(user: Pokemon, target: Pokemon, move: Move): void {
    if (this.condition && !this.condition(user, target, move)) {
      return;
    }
    const statChangeAttr = new StatStageChangeAttr(this.stats, this.stages, this.showMessage);
    statChangeAttr.applyEffect(user, target, move);
  }

  /**
   * @returns (+3) if the user is expected to KO the target with the given move. Combined with Attack Score, this
   * means a KO will yield a (+7) score, meaning the AI will prioritize moves with this effect over moves with
   * high priority. Under the same conditions, if the user has Contrary, this grants a {@linkcode BAD_MOVE_PENALTY}.
   */
  public override getEffectScore(user: EnemyPokemon, target: Pokemon, move: Move): number {
    if (
      user.getExpectedAttackScore(target, move) >= KO_ATTACK_SCORE
      && this.stats.some((stat) => user.getStatStage(stat) < 6)
    ) {
      return user.hasAbility(AbilityId.CONTRARY) ? BAD_MOVE_PENALTY : 3;
    }
    return 0;
  }
}
