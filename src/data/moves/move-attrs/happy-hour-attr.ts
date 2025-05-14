import { BAD_MOVE_PENALTY } from "#app/constants/ai-constants";
import type { Move } from "#app/data/moves/move";
import { AddArenaTagAttr } from "#app/data/moves/move-attrs/add-arena-tag-attr";
import type { EnemyPokemon } from "#app/field/enemy-pokemon";
import type { Pokemon } from "#app/field/pokemon";
import { ArenaTagRelativeSide } from "#enums/arena-tag-relative-side";
import { ArenaTagType } from "#enums/arena-tag-type";

/**
 * Attribute to apply the effect of {@link https://bulbapedia.bulbagarden.net/wiki/Happy_Hour_(move) | Happy Hour}.
 * Doubles the money given to the Player at the end of the current battle.
 * @extends AddArenaTagAttr
 */
export class HappyHourAttr extends AddArenaTagAttr {
  constructor() {
    super(ArenaTagType.HAPPY_HOUR, ArenaTagRelativeSide.USER, { failOnOverlap: true });
  }

  /**
   * Grants a {@link BAD_MOVE_PENALTY | major penalty} in all game states.
   * Currently, this attribute just gives money to the Player
   * no matter who uses it.
   */
  public override getEffectScore(_user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    return BAD_MOVE_PENALTY;
  }
}
