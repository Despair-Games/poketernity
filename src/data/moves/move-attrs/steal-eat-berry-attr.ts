import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { BooleanHolder } from "#app/utils";
import i18next from "i18next";
import { applyAbAttrs } from "#app/data/abilities/apply-ab-attrs";
import type { Move } from "#app/data/moves/move";
import { EatBerryAttr } from "#app/data/moves/move-attrs/eat-berry-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";

/**
 * Attribute used for moves that steal a random berry from the target. The user then eats the stolen berry.
 * Used for Pluck & Bug Bite.
 * @extends EatBerryAttr
 */
export class StealEatBerryAttr extends EatBerryAttr {
  constructor() {
    super(false);
  }

  override apply(user: Pokemon, target: Pokemon, _move: Move): boolean {
    const cancelled = new BooleanHolder(false);
    applyAbAttrs(AbAttrFlag.BLOCK_ITEM_THEFT, target, false, cancelled); // check for abilities that block item theft
    if (cancelled.value === true) {
      return false;
    }

    const heldBerries = this.getTargetHeldBerries(target);
    if (heldBerries.length <= 0) {
      return false;
    }
    // if the target has berries, pick a random berry and steal it
    this.chosenBerry = heldBerries[user.randSeedInt(heldBerries.length)];
    applyAbAttrs(AbAttrFlag.POST_ITEM_LOST, target, false);
    const message = i18next.t("battle:stealEatBerry", {
      pokemonName: user.name,
      targetName: target.name,
      berryName: this.chosenBerry.type.name,
    });
    globalScene.queueMessage(message);
    this.reduceBerryModifier(target);
    this.eatBerry(user, target);
    return true;
  }
}
