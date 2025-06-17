import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveCategory } from "#enums/move-category";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";
import i18next from "i18next";

/**
 * Attribute to {@link https://bulbapedia.bulbagarden.net/wiki/Confusion_(status_condition) | confuse}
 * the user or target.
 */
export class ConfuseAttr extends AddBattlerTagAttr {
  constructor(axeKick?: boolean) {
    // Axe Kick has the odd mechanic of guranteeing 3 turns of confuse instead of 2
    const minConfuseTurns = axeKick ? 3 : 2;
    super(BattlerTagType.CONFUSED, false, { turnCountMin: minConfuseTurns, turnCountMax: 5 });
  }

  override applyEffect(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!this.selfTarget && target.isSafeguarded(user)) {
      if (move.category === MoveCategory.STATUS) {
        globalScene.phaseManager.createAndUnshiftPhase(
          "MessagePhase",
          i18next.t("moveTriggers:safeguard", { targetName: getPokemonNameWithAffix(target) }),
        );
      }
      return false;
    }

    return super.applyEffect(user, target, move);
  }
}
