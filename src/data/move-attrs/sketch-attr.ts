import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { Moves } from "#enums/moves";
import i18next from "i18next";
import { type Move, allMoves } from "../move";
import { targetMoveCopiableCondition, type MoveConditionFunc } from "../move-conditions";
import { MoveEffectAttr } from "./move-effect-attr";

/**
 * Attribute for {@linkcode Moves.SKETCH} that causes the user to copy the opponent's last used move
 * This move copies the last used non-virtual move
 *  e.g. if Metronome is used, it copies Metronome itself, not the virtual move called by Metronome
 * Fails if the opponent has not yet used a move.
 * Fails if used on an uncopiable move, listed in unsketchableMoves in getCondition
 * Fails if the move is already in the user's moveset
 */
export class SketchAttr extends MoveEffectAttr {
  constructor() {
    super(true);
  }
  /**
   * User copies the opponent's last used move, if possible
   * @param user Pokemon that used the move and will replace Sketch with the copied move
   * @param target Pokemon that the user wants to copy a move from
   * @param move Move being used
   * @param args Unused
   * @returns `true` if the function succeeds, otherwise `false`
   */

  override apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    const targetMove = target
      .getLastXMoves(-1)
      .find((m) => m.move !== Moves.NONE && m.move !== Moves.STRUGGLE && !m.virtual);
    if (!targetMove) {
      return false;
    }

    const sketchedMove = allMoves[targetMove.move];
    const sketchIndex = user.getMoveset().findIndex((m) => m.moveId === move.id);
    if (sketchIndex === -1) {
      return false;
    }

    user.setMove(sketchIndex, sketchedMove.id);

    globalScene.queueMessage(
      i18next.t("moveTriggers:sketchedMove", {
        pokemonName: getPokemonNameWithAffix(user),
        moveName: sketchedMove.name,
      }),
    );

    return true;
  }

  override getCondition(): MoveConditionFunc {
    return (user, target, move) => {
      if (!targetMoveCopiableCondition(user, target, move)) {
        return false;
      }

      const targetMove = target
        .getMoveHistory()
        .filter((m) => !m.virtual)
        .at(-1);
      if (!targetMove) {
        return false;
      }

      const unsketchableMoves = [
        Moves.CHATTER,
        Moves.MIRROR_MOVE,
        Moves.SLEEP_TALK,
        Moves.STRUGGLE,
        Moves.SKETCH,
        Moves.REVIVAL_BLESSING,
        Moves.TERA_STARSTORM,
        Moves.BREAKNECK_BLITZ__PHYSICAL,
        Moves.BREAKNECK_BLITZ__SPECIAL,
      ];

      if (unsketchableMoves.includes(targetMove.move)) {
        return false;
      }

      if (user.getMoveset().find((m) => m.moveId === targetMove.move)) {
        return false;
      }

      return true;
    };
  }
}
