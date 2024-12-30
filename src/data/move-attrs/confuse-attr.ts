import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveCategory } from "#enums/move-category";
import i18next from "i18next";
import type { Move } from "../move";
import { AddBattlerTagAttr } from "./add-battler-tag-attr";

export class ConfuseAttr extends AddBattlerTagAttr {
  constructor(selfTarget?: boolean) {
    super(BattlerTagType.CONFUSED, selfTarget, { turnCountMin: 2, turnCountMax: 5 });
  }

  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!this.selfTarget && target.isSafeguarded(user)) {
      if (move.category === MoveCategory.STATUS) {
        globalScene.queueMessage(i18next.t("moveTriggers:safeguard", { targetName: getPokemonNameWithAffix(target) }));
      }
      return false;
    }

    return super.apply(user, target, move);
  }
}
