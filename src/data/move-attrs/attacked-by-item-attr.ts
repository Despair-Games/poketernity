import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";
import type { MoveConditionFunc } from "../move-conditions";

/**
 * Attribute to cause the move to fail if the target is not holding an item.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Poltergeist_(move) Poltergeist}.
 * @extends MoveAttr
 */
export class AttackedByItemAttr extends MoveAttr {
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
