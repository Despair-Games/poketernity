import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagType } from "#enums/battler-tag-type";
import i18next from "i18next";
import type { Move } from "../move";
import { AddBattlerTagAttr } from "./add-battler-tag-attr";

export class IgnoreAccuracyAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.IGNORE_ACCURACY, true, { turnCountMin: 2 });
  }

  /** Adds an effect that prevents the user from missing the target for the next 2 turns */
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!super.apply(user, target, move)) {
      return false;
    }

    globalScene.queueMessage(
      i18next.t("moveTriggers:tookAimAtTarget", {
        pokemonName: getPokemonNameWithAffix(user),
        targetName: getPokemonNameWithAffix(target),
      }),
    );

    return true;
  }
}
