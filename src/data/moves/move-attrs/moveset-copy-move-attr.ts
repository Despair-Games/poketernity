import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { Pokemon } from "#field/pokemon";
import { PokemonMove } from "#field/pokemon-move";
import type { Move } from "#moves/move";
import { OverrideMoveEffectAttr } from "#moves/override-move-effect-attr";
import { targetMoveCopiableCondition } from "#moves/target-move-copiable-condition";
import type { MoveConditionFunc } from "#types/move-types";
import i18next from "i18next";

/**
 * Attribute to copy the target's last used move into the user's moveset,
 * temporarily replacing the move with this attribute.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Mimic_(move) | Mimic}.
 */
export class MovesetCopyMoveAttr extends OverrideMoveEffectAttr {
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    const targetMoves = target.getMoveHistory().filter((m) => !m.virtual);
    if (!targetMoves.length) {
      return false;
    }

    const copiedMove = targetMoves[0];

    const thisMoveIndex = user.getMoveset().findIndex((m) => m.moveId === move.id);

    if (thisMoveIndex === -1) {
      return false;
    }

    user.summonData.moveset = user.getMoveset().slice(0);
    user.summonData.moveset[thisMoveIndex] = new PokemonMove(copiedMove.move.id, 0, 0);

    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("moveTriggers:copiedMove", {
        pokemonName: getPokemonNameWithAffix(user),
        moveName: copiedMove.move?.name,
      }),
    );

    return true;
  }

  override getCondition(): MoveConditionFunc {
    return targetMoveCopiableCondition;
  }
}
