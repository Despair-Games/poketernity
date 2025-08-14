import { BAD_MOVE_PENALTY } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import { StatusEffect } from "#enums/status-effect";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveAttr } from "#moves/move-attr";

/**
 * Attribute to allow the user to use the associated move while asleep.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Snore_(move) | Snore}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Sleep_Talk_(move) | Sleep Talk}.
 */
export class BypassSleepAttr extends MoveAttr {
  public override apply(user: Pokemon, _target: Pokemon | null, move: Move): boolean {
    if (user.hasStatusEffect(StatusEffect.SLEEP)) {
      user.addTag(BattlerTagType.BYPASS_SLEEP, 1, move.id, user.id);
      return true;
    }

    return false;
  }

  /**
   * @returns
   * - (+6) if the user is asleep, minus (2) for each turn the user has already slept.
   * - A {@linkcode BAD_MOVE_PENALTY} if the user is not asleep
   * @todo Should the penalty be enforced by Snore/Sleep Talk's conditions instead?
   */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    if (user.hasStatusEffect(StatusEffect.SLEEP)) {
      return 6 - 2 * user.turnsAsleep;
    }
    return BAD_MOVE_PENALTY;
  }
}
