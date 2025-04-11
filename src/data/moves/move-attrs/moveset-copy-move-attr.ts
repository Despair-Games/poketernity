import { type Pokemon } from "#app/field/pokemon";
import { PokemonMove } from "#app/field/pokemon-move";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import { type Move } from "#app/data/moves/move";
import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import { targetMoveCopiableCondition } from "#app/data/moves/move-conditions/target-move-copiable-condition";
import { OverrideMoveEffectAttr } from "#app/data/moves/move-attrs/override-move-effect-attr";

/**
 * Attribute to copy the target's last used move into the user's moveset,
 * temporarily replacing the move with this attribute.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Mimic_(move) | Mimic}.
 * @extends OverrideMoveEffectAttr
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

    globalScene.phaseManager.queueMessagePhase(
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
