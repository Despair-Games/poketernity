import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { MoveId } from "#enums/move-id";
import i18next from "i18next";
import { type Move } from "../move";
import { allMoves } from "#app/data/data-lists";
import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import { targetMoveCopiableCondition } from "../move-conditions/target-move-copiable-condition";
import { MoveEffectAttr } from "./move-effect-attr";

/**
 * Attribute for {@linkcode MoveId.SKETCH} that causes the user to copy the opponent's last used move.
 * This move copies the last used non-virtual move
 * e.g. if Metronome is used, it copies Metronome itself, not the virtual move called by Metronome.
 *
 * Fails if:
 * - the opponent has not yet used a move.
 * - used on an uncopiable move, listed in unsketchableMoves in getCondition.
 * - the move is already in the user's moveset.
 * @extends MoveEffectAttr
 */
export class SketchAttr extends MoveEffectAttr {
  constructor() {
    super(true);
  }

  override applyEffect(user: Pokemon, target: Pokemon, move: Move): boolean {
    const targetMove = target
      .getLastXMoves(-1)
      .find((m) => m.move.id !== MoveId.NONE && m.move.id !== MoveId.STRUGGLE && !m.virtual);
    if (!targetMove) {
      return false;
    }

    const sketchedMove = allMoves.get(targetMove.move.id);
    const sketchIndex = user.getMoveset().findIndex((m) => m.moveId === move.id);
    if (sketchIndex === -1) {
      return false;
    }

    user.setMove(sketchIndex, sketchedMove.id);

    globalScene.phaseManager.queueMessagePhase(
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
        MoveId.CHATTER,
        MoveId.MIRROR_MOVE,
        MoveId.SLEEP_TALK,
        MoveId.STRUGGLE,
        MoveId.SKETCH,
        MoveId.REVIVAL_BLESSING,
        MoveId.TERA_STARSTORM,
        MoveId.BREAKNECK_BLITZ__PHYSICAL,
        MoveId.BREAKNECK_BLITZ__SPECIAL,
      ];

      if (unsketchableMoves.includes(targetMove.move.id)) {
        return false;
      }

      if (user.getMoveset().find((m) => m.moveId === targetMove.move.id)) {
        return false;
      }

      return true;
    };
  }
}
