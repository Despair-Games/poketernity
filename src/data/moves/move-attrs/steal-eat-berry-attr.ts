import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import { globalScene } from "#app/global-scene";
import type { Pokemon } from "#field/pokemon";
import { EatBerryAttr } from "#moves/eat-berry-attr";
import type { Move } from "#moves/move";
import { ValueHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Attribute used for moves that steal a random berry from the target.
 * The user then eats the stolen berry.
 *
 * Used for Pluck & Bug Bite.
 */
export class StealEatBerryAttr extends EatBerryAttr {
  constructor() {
    super(false);
  }

  override apply(user: Pokemon, target: Pokemon, _move: Move): boolean {
    const cancelled = new ValueHolder(false);
    applyAbAttrs("BlockItemTheftAbAttr", target, false, cancelled);
    if (cancelled.value === true) {
      return false;
    }

    const heldBerries = this.getTargetHeldBerries(target);
    if (heldBerries.length <= 0) {
      return false;
    }
    // if the target has berries, pick a random berry and steal it
    this.chosenBerry = heldBerries[user.randSeedInt(heldBerries.length)];
    applyAbAttrs("PostItemLostAbAttr", target, false);
    const message = i18next.t("battle:stealEatBerry", {
      pokemonName: user.name,
      targetName: target.name,
      berryName: this.chosenBerry.type.name,
    });
    globalScene.phaseManager.createAndUnshiftPhase("MessagePhase", message);
    this.reduceBerryModifier(target);
    this.eatBerry(user, target);
    return true;
  }
}
