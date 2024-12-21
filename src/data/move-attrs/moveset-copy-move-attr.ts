import { type Pokemon, PokemonMove } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import { type Move, allMoves } from "../move";
import { targetMoveCopiableCondition, type MoveConditionFunc } from "../move-conditions";
import { OverrideMoveEffectAttr } from "./override-move-effect-attr";

export class MovesetCopyMoveAttr extends OverrideMoveEffectAttr {
  override apply(user: Pokemon, target: Pokemon, move: Move, _args: any[]): boolean {
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
