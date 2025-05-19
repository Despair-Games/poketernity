import { getPokemonNameWithAffix } from "#app/messages";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { PreMoveMessageAttr } from "#moves/pre-move-message-attr";
import type { MoveConditionFunc } from "#types/move-condition-func";
import i18next from "i18next";

/**
 * Attribute to cause the move to fail if the target is not holding an item.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Poltergeist_(move) | Poltergeist}.
 * @extends PreMoveMessageAttr
 */
export class AttackedByItemAttr extends PreMoveMessageAttr {
  constructor() {
    super((_user, target, _move) => {
      const heldItems = target.getHeldItems().filter((i) => i.isTransferable);
      // "item" should be localizable here but under normal circumstances this fallback should never show
      const itemName = heldItems[0]?.type?.name ?? "item";

      return i18next.t("moveTriggers:attackedByItem", {
        pokemonName: getPokemonNameWithAffix(target),
        itemName,
      });
    });
  }

  /** Causes failure if the target isn't holding a transferable item */
  override getCondition(): MoveConditionFunc {
    return (_user: Pokemon, target: Pokemon, _move: Move) => target.getHeldItems().some((i) => i.isTransferable);
  }
}
