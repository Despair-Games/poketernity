import type { BideTag } from "#app/data/battler-tags/bide-tag";
import { VariableMoveMessageAttr } from "#app/data/moves/move-attrs/variable-move-message-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagType } from "#enums/battler-tag-type";
import i18next from "i18next";

/**
 * Attribute for Bide's custom move messages.
 * The message displayed depends on the turn in the move's execution:
 * - Turn 1: Uses the default message
 * - Final turn: "{user} unleashed its energy!"
 * - Other turns: "{user} is storing energy!"
 * @extends VariableMoveMessageAttr
 * @see {@link https://www.youtube.com/watch?v=nJyNVe5RQlM | Bide Gens 1-9}
 */
export class BideMessageAttr extends VariableMoveMessageAttr {
  constructor() {
    super((user, _target, _move) => {
      const bideTag = user.getTag<BideTag>(BattlerTagType.BIDE);
      switch (bideTag?.turnCount) {
        case undefined:
          // Use the default message
          return undefined;
        case 1:
          // "{Pokemon} unleashed its energy!"
          return i18next.t("moveTriggers:bideUnleashedEnergy", {
            pokemonNameWithAffix: getPokemonNameWithAffix(user),
          });
        default:
          // "{Pokemon} is storing energy!"
          return i18next.t("moveTriggers:bideStoringEnergy", {
            pokemonNameWithAffix: getPokemonNameWithAffix(user),
          });
      }
    });
  }
}
