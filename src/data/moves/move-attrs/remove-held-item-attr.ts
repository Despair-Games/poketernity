import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { BlockItemTheftAbAttr } from "#abilities/block-item-theft-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { PokemonHeldItemModifier } from "#modifier/modifier";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import { BooleanHolder } from "#utils/common-utils";
import i18next from "i18next";

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

  override applyEffect(user: Pokemon, target: Pokemon, _move: Move): boolean {
    if (!this.berriesOnly && target.isPlayer()) {
      // "Wild Pokemon cannot knock off Player Pokemon's held items" (See Bulbapedia)
      return false;
    }

    const cancelled = new BooleanHolder(false);

    applyAbAttrs<BlockItemTheftAbAttr>(AbAttrFlag.BLOCK_ITEM_THEFT, target, false, cancelled);

    if (cancelled.value === true) {
      return false;
    }

    // Considers entire transferrable item pool by default (Knock Off). Otherwise berries only if specified (Incinerate).
    let heldItems = this.getTargetHeldItems(target).filter((i) => i.isTransferable);

    if (this.berriesOnly) {
      heldItems = heldItems.filter((m) => m.isBerryModifier() && m.pokemonId === target.id, target.isPlayer());
    }

    if (heldItems.length) {
      const removedItem = heldItems[user.randSeedInt(heldItems.length)];

      // Decrease item amount and update icon
      target.loseHeldItem(removedItem);
      globalScene.updateModifiers(target.isPlayer());

      if (this.berriesOnly) {
        globalScene.phaseManager.queueMessagePhase(
          i18next.t("moveTriggers:incineratedItem", {
            pokemonName: getPokemonNameWithAffix(user),
            targetName: getPokemonNameWithAffix(target),
            itemName: removedItem.type.name,
          }),
        );
      } else {
        globalScene.phaseManager.queueMessagePhase(
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
      (m) => m.isPokemonHeldItemModifier() && m.pokemonId === target.id,
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
