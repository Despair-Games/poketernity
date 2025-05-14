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
 * @extends AddBattlerTagAttr
 */
export class ConfuseAttr extends AddBattlerTagAttr {
  constructor(selfTarget?: boolean) {
    super(BattlerTagType.CONFUSED, selfTarget, { turnCountMin: 2, turnCountMax: 5 });
  }

  override applyEffect(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!this.selfTarget && target.isSafeguarded(user)) {
      if (move.category === MoveCategory.STATUS) {
        globalScene.phaseManager.queueMessagePhase(
          i18next.t("moveTriggers:safeguard", { targetName: getPokemonNameWithAffix(target) }),
        );
      }
      return false;
    }

    return super.applyEffect(user, target, move);
  }
}
