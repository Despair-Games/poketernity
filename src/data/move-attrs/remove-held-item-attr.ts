import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BerryModifier, PokemonHeldItemModifier } from "#app/modifier/modifier";
import { BooleanHolder } from "#app/utils";
import i18next from "i18next";
import { BlockItemTheftAbAttr } from "#app/data/ab-attrs/block-item-theft-ab-attr";
import { applyAbAttrs } from "#app/data/ability";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Removes a random held item (or berry) from target.
 * Used for Incinerate and Knock Off.
 * Not Implemented Cases: (Same applies for Thief)
 * "If the user faints due to the target's Ability (Rough Skin or Iron Barbs) or held Rocky Helmet, it cannot remove the target's held item."
 * "If Knock Off causes a Pokémon with the Sticky Hold Ability to faint, it can now remove that Pokémon's held item."
 */
export class RemoveHeldItemAttr extends MoveEffectAttr {
  /** Optional restriction for item pool to berries only i.e. Differentiating Incinerate and Knock Off */
  private berriesOnly: boolean;

  constructor(berriesOnly: boolean) {
    super(false);
    this.berriesOnly = berriesOnly;
  }

  /**
   *
   * @param user {@linkcode Pokemon} that used the move
   * @param target Target {@linkcode Pokemon} that the moves applies to
   * @param move {@linkcode Move} that is used
   * @param _args N/A
   * @returns `True` if an item was removed
   */
  override apply(user: Pokemon, target: Pokemon, _move: Move): boolean {
    if (!this.berriesOnly && target.isPlayer()) {
      // "Wild Pokemon cannot knock off Player Pokemon's held items" (See Bulbapedia)
      return false;
    }

    const cancelled = new BooleanHolder(false);
    applyAbAttrs(BlockItemTheftAbAttr, target, cancelled); // Check for abilities that block item theft

    if (cancelled.value === true) {
      return false;
    }

    // Considers entire transferrable item pool by default (Knock Off). Otherwise berries only if specified (Incinerate).
    let heldItems = this.getTargetHeldItems(target).filter((i) => i.isTransferable);

    if (this.berriesOnly) {
      heldItems = heldItems.filter((m) => m instanceof BerryModifier && m.pokemonId === target.id, target.isPlayer());
    }

    if (heldItems.length) {
      const removedItem = heldItems[user.randSeedInt(heldItems.length)];

      // Decrease item amount and update icon
      target.loseHeldItem(removedItem);
      globalScene.updateModifiers(target.isPlayer());

      if (this.berriesOnly) {
        globalScene.queueMessage(
          i18next.t("moveTriggers:incineratedItem", {
            pokemonName: getPokemonNameWithAffix(user),
            targetName: getPokemonNameWithAffix(target),
            itemName: removedItem.type.name,
          }),
        );
      } else {
        globalScene.queueMessage(
          i18next.t("moveTriggers:knockedOffItem", {
            pokemonName: getPokemonNameWithAffix(user),
            targetName: getPokemonNameWithAffix(target),
            itemName: removedItem.type.name,
          }),
        );
      }
    }

    return true;
  }

  getTargetHeldItems(target: Pokemon): PokemonHeldItemModifier[] {
    return globalScene.findModifiers(
      (m) => m instanceof PokemonHeldItemModifier && m.pokemonId === target.id,
      target.isPlayer(),
    ) as PokemonHeldItemModifier[];
  }

  override getUserBenefitScore(_user: Pokemon, target: Pokemon, _move: Move): number {
    const heldItems = this.getTargetHeldItems(target);
    return heldItems.length ? 5 : 0;
  }

  override getTargetBenefitScore(_user: Pokemon, target: Pokemon, _move: Move): number {
    const heldItems = this.getTargetHeldItems(target);
    return heldItems.length ? -5 : 0;
  }
}
