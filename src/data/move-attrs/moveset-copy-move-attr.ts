import { type Pokemon, PokemonMove } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import { type Move } from "../move";
import { allMoves } from "#app/data/all-moves";
import { targetMoveCopiableCondition, type MoveConditionFunc } from "../move-conditions";
import { OverrideMoveEffectAttr } from "./override-move-effect-attr";

/**
 * Attribute to copy the target's last used move into the user's moveset,
 * temporarily replacing the move with this attribute.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Mimic_(move) Mimic}.
 * @extends OverrideMoveEffectAttr
 */
export class MovesetCopyMoveAttr extends OverrideMoveEffectAttr {
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    const targetMoves = target.getMoveHistory().filter((m) => !m.virtual);
    if (!targetMoves.length) {
      return false;
    }

    const copiedMove = allMoves[targetMoves[0].move];

    const thisMoveIndex = user.getMoveset().findIndex((m) => m.moveId === move.id);

    if (thisMoveIndex === -1) {
      return false;
    }

    user.summonData.moveset = user.getMoveset().slice(0);
    user.summonData.moveset[thisMoveIndex] = new PokemonMove(copiedMove.id, 0, 0);

    globalScene.queueMessage(
      i18next.t("moveTriggers:copiedMove", { pokemonName: getPokemonNameWithAffix(user), moveName: copiedMove.name }),
    );

    return true;
  }

  override getCondition(): MoveConditionFunc {
    return targetMoveCopiableCondition;
  }
}
