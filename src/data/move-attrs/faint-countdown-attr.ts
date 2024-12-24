import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagType } from "#enums/battler-tag-type";
import i18next from "i18next";
import type { Move } from "../move";
import { AddBattlerTagAttr } from "./add-battler-tag-attr";

export class FaintCountdownAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.PERISH_SONG, false, {
      failOnOverlap: true,
      turnCountMin: 4,
    });
  }

  override apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    globalScene.queueMessage(
      i18next.t("moveTriggers:faintCountdown", {
        pokemonName: getPokemonNameWithAffix(target),
        turnCount: this.turnCountMin - 1,
      }),
    );

    return true;
  }
}
