import { PostSummonMessageAbAttr } from "#abilities/post-summon-message-ab-attr";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import { OneHitKOAttr } from "#moves/one-hit-ko-attr";

/**
 * Ability Attribute for Anticipation.
 * When a Pokémon with Anticipation enters the battle or a Pokémon gains the Ability Anticipation, it causes the Pokémon to "shudder" if an opponent has a damaging move that is super effective against the Pokémon with Anticipation or a one-hit knockout move.
 * Shuddering has no actual effect, except that the presence of the Ability message is meant to provide information about possible moves the opponent might have.
 * @extends PostSummonMessageAbAttr
 */
export class AnticipationAbAttr extends PostSummonMessageAbAttr {
  override apply(pokemon: Pokemon, simulated: boolean): boolean {
    for (const opponent of pokemon.getOpponents()) {
      for (const pkmMove of opponent.getMoveset()) {
        const move = pkmMove.getMove();
        if (move.isAttackMove()) {
          // Hidden Power is the only exception to Anticipation's interactions with variable type moves. Anticipation considers the type of most other variable-type moves to be their default type.
          const moveType = move.id !== MoveId.HIDDEN_POWER ? move.type : opponent.getMoveType(move, simulated);
          // Anticipation does not consider the effects of Strong Winds and Gravity on moves or opponent move type-changing abilities
          if (pokemon.getAttackTypeEffectiveness(moveType, undefined, true, simulated) >= 2) {
            return super.apply(pokemon, simulated);
          }
          if (move.hasAttr(OneHitKOAttr)) {
            return super.apply(pokemon, simulated);
          }
        }
      }
    }
    return false;
  }
}
