import type { ShellTrapTag } from "#battler-tags/shell-trap-tag";
import { MAJOR_EFFECT_SCORE_PENALTY } from "#constants/ai-constants";
import { AbilityApplyMode } from "#enums/ability-apply-mode";
import { BattlerTagType } from "#enums/battler-tag-type";
import { Stat } from "#enums/stat";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveCondition } from "#moves/move-condition";
import type { MoveConditionFunc } from "#types/MoveConditionFunc";

/**
 * Condition for the move {@link https://bulbapedia.bulbagarden.net/wiki/Shell_Trap_(move) | Shell Trap}.
 * Requires another Pokemon to have "activated" the user's trap
 * by dealing physical damage to the user.
 * @extends MoveCondition
 * @see {@linkcode ShellTrapTag}
 */
export class ShellTrapCondition extends MoveCondition {
  constructor() {
    super(shellTrapCondition);
  }

  /**
   * Grants (-2) for each opponent that has higher {@linkcode Stat.SPATK | Sp. Atk}
   * than {@linkcode Stat.ATK | Attack}.
   */
  public override getConditionScore(user: EnemyPokemon, _target: Pokemon, move: Move): number {
    const opponents = user.getOpponents();
    return opponents
      .map((p) =>
        p.getEffectiveStat(Stat.ATK, user, move, AbilityApplyMode.REVEALED)
        > p.getEffectiveStat(Stat.SPATK, user, move, AbilityApplyMode.REVEALED)
          ? 0
          : MAJOR_EFFECT_SCORE_PENALTY,
      )
      .reduce((total, score) => total + score, 0);
  }
}

const shellTrapCondition: MoveConditionFunc = (user, _target, _move) =>
  user.getTag<ShellTrapTag>(BattlerTagType.SHELL_TRAP)?.activated === true;
