import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { BooleanHolder } from "#app/utils";
import i18next from "i18next";
import { BlockItemTheftAbAttr } from "#app/data/ab-attrs/block-item-theft-ab-attr";
import { PostItemLostAbAttr } from "#app/data/ab-attrs/post-item-lost-ab-attr";
import { applyAbAttrs, applyPostItemLostAbAttrs } from "#app/data/ability";
import type { Move } from "#app/data/move";
import { EatBerryAttr } from "#app/data/move-attrs/eat-berry-attr";

/**
 * Attribute used for moves that steal a random berry from the target. The user then eats the stolen berry.
 * Used for Pluck & Bug Bite.
 * @extends EatBerryAttr
 */
export class StealEatBerryAttr extends EatBerryAttr {
  constructor() {
    super(false);
  }

  /** User steals a random berry from the target and then eats it. */
  override apply(user: Pokemon, target: Pokemon, _move: Move): boolean {
    const cancelled = new BooleanHolder(false);
    applyAbAttrs(BlockItemTheftAbAttr, target, cancelled); // check for abilities that block item theft
    if (cancelled.value === true) {
      return false;
    }

    const heldBerries = this.getTargetHeldBerries(target);
    if (heldBerries.length <= 0) {
      return false;
    }
    // if the target has berries, pick a random berry and steal it
    this.chosenBerry = heldBerries[user.randSeedInt(heldBerries.length)];
    applyPostItemLostAbAttrs(PostItemLostAbAttr, target, false);
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
