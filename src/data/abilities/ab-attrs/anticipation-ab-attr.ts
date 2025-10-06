import { PostSummonMessageAbAttr } from "#abilities/post-summon-message-ab-attr";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { OneHitKOAttr } from "#moves/one-hit-ko-attr";

/**
 * Ability Attribute for Anticipation.
 * When a Pokémon with Anticipation enters the battle or a Pokémon gains the Ability Anticipation, it causes the Pokémon to "shudder" if an opponent has a damaging move that is super effective against the Pokémon with Anticipation or a one-hit knockout move.
 * Shuddering has no actual effect, except that the presence of the Ability message is meant to provide information about possible moves the opponent might have.
 */
export class AnticipationAbAttr extends PostSummonMessageAbAttr {
  /**
   * @returns `true` if a super-effective move is detected against the source Pokemon
   * from any of its opponents.
   *
   * Effectiveness is determined based on the move's final type (*unless the move is Hidden Power*)
   * and does not account for field conditions such as Strong Winds and Gravity.
   */
  public override canApply(...[pokemon]: Parameters<this["apply"]>): boolean {
    return this.getOpposingMoves(pokemon).some(([opp, move]) => {
      if (!move.isAttackMove()) {
        return false;
      }

      if (move.hasAttr(OneHitKOAttr)) {
        return true;
      }

      // Variable-type moves (other than Hidden Power) are evaluated by their base type
      const moveType = move.id === MoveId.HIDDEN_POWER ? opp.getMoveType(move) : move.type;
      // Effectiveness ignores modifiers from field effects (e.g. Strong Winds)
      return pokemon.getAttackTypeEffectiveness(moveType, undefined, true, true) >= 2;
    });
  }

  private getOpposingMoves(pokemon: Pokemon): [Pokemon, Move][] {
    return pokemon
      .getOpponents()
      .flatMap((opp) => opp.getMoveset().map((pkmMove) => [opp, pkmMove.getMove()] as [Pokemon, Move]));
  }
}
