import { MINOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { ArenaTagRelativeSide } from "#enums/arena-tag-relative-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { AddArenaTagAttr } from "#moves/move-attrs/add-arena-tag-attr";

/**
 * Attribute to apply the effects of {@link https://bulbapedia.bulbagarden.net/wiki/Tailwind_(move) | Tailwind}.
 * Doubles the Speed of the user and its party for 4 turns.
 * @extends AddArenaTagAttr
 */
export class TailwindAttr extends AddArenaTagAttr {
  constructor() {
    super(ArenaTagType.TAILWIND, ArenaTagRelativeSide.USER, { turnCount: 4, failOnOverlap: true });
  }

  /** Grants a (+1) bonus for each active Pokemon on the user's side */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    return user.getField().filter((p) => p.isActive(true)).length * MINOR_EFFECT_SCORE_BONUS;
  }
}
