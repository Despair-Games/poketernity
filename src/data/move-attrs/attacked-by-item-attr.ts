import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import type { MoveConditionFunc, Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";

/**
 * The move only works if the target has a transferable held item
 * @extends MoveAttr
 * @see {@linkcode getCondition}
 */
export class AttackedByItemAttr extends MoveAttr {
  /**
   * @returns the {@linkcode MoveConditionFunc} for this {@linkcode Move}
   */
  override getCondition(): MoveConditionFunc {
    return (_user: Pokemon, target: Pokemon, _move: Move) => {
      const heldItems = target.getHeldItems().filter((i) => i.isTransferable);
      if (heldItems.length === 0) {
        return false;
      }

      const itemName = heldItems[0]?.type?.name ?? "item";
      globalScene.queueMessage(
        i18next.t("moveTriggers:attackedByItem", { pokemonName: getPokemonNameWithAffix(target), itemName: itemName }),
      );

      return true;
    };
  }
}
