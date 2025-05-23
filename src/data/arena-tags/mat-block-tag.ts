import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { ConditionalProtectTag } from "#arena-tags/conditional-protect-tag";
import { allMoves } from "#data/data-lists";
import type { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveCategory } from "#enums/move-category";
import { MoveId } from "#enums/move-id";
import type { Arena } from "#field/arena";
import type { ProtectConditionFunc } from "#types/protect-condition-func";
import i18next from "i18next";

/**
 * Condition function for {@link https://bulbapedia.bulbagarden.net/wiki/Mat_Block_(move) Mat Block's}
 * protection effect.
 * @param _arena {@linkcode Arena} The arena containing the protection effect.
 * @param moveId {@linkcode MoveId} The move to check against this condition.
 * @returns `true` if the incoming move is not a Status move.
 */
const MatBlockConditionFunc: ProtectConditionFunc = (_arena, moveId): boolean => {
  const move = allMoves.get(moveId);
  return move.category !== MoveCategory.STATUS;
};

/**
 * Arena Tag class for {@link https://bulbapedia.bulbagarden.net/wiki/Mat_Block_(move) Mat Block}
 * Condition: The incoming move is a Physical or Special attack move.
 * @extends ConditionalProtectTag
 */
export class MatBlockTag extends ConditionalProtectTag {
  constructor(sourceId: number, side: ArenaTagSide) {
    super(ArenaTagType.MAT_BLOCK, MoveId.MAT_BLOCK, sourceId, side, MatBlockConditionFunc);
  }

  override onAdd(_arena: Arena) {
    if (this.sourceId) {
      const source = globalScene.getPokemonById(this.sourceId);
      if (source) {
        globalScene.phaseManager.queueMessagePhase(
          i18next.t("arenaTag:matBlockOnAdd", { pokemonNameWithAffix: getPokemonNameWithAffix(source) }),
        );
      } else {
        console.warn("Failed to get source for MatBlockTag onAdd");
      }
    }
  }
}
