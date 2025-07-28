import { globalScene } from "#app/global-scene";
import { MAJOR_EFFECT_SCORE_PENALTY, MINOR_EFFECT_SCORE_PENALTY } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import { StatusEffect } from "#enums/status-effect";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute for the move-locking effect of {@link https://bulbapedia.bulbagarden.net/wiki/Uproar_(move) | Uproar}.
 * Puts the user into an "uproar" for 3 turns, forcing them to
 * attack with the same move each turn and waking up all asleep
 * Pokemon on the field.
 * @extends AddBattlerTagAttr
 */
export class UproarAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.UPROAR, true);
  }

  /**
   * Grants (-1) + (# of asleep allies) - (# of asleep enemies).
   * The total score from this attribute cannot be lower than (-2).
   */
  public override getRawEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    const otherAsleepPokemon = globalScene
      .getField(true)
      .filter((p) => p !== user && p.hasStatusEffect(StatusEffect.SLEEP, false, true));
    const sleepScore = otherAsleepPokemon.reduce((total, pokemon) => total + (user.isOpponent(pokemon) ? -1 : 1), 0);

    return Math.max(MINOR_EFFECT_SCORE_PENALTY + sleepScore, MAJOR_EFFECT_SCORE_PENALTY);
  }
}
