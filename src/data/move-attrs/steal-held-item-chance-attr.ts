import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { ModifierPoolType } from "#app/modifier/modifier-type";
import { PokemonHeldItemModifier } from "#app/modifier/modifier";
import i18next from "i18next";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * The following needs to be implemented for Thief
 * "If the user faints due to the target's Ability (Rough Skin or Iron Barbs) or held Rocky Helmet, it cannot remove the target's held item."
 * "If Knock Off causes a Pokémon with the Sticky Hold Ability to faint, it can now remove that Pokémon's held item."
 */
export class StealHeldItemChanceAttr extends MoveEffectAttr {
  private chance: number;

  constructor(chance: number) {
    super(false);
    this.chance = chance;
  }

  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (move.hitsSubstitute(user, target)) {
      return false;
    }

    const rand = Phaser.Math.RND.realInRange(0, 1);
    if (rand >= this.chance) {
      return false;
    }
    const heldItems = this.getTargetHeldItems(target).filter((i) => i.isTransferable);
    if (heldItems.length) {
      const poolType = target.isPlayer()
        ? ModifierPoolType.PLAYER
        : target.hasTrainer()
          ? ModifierPoolType.TRAINER
          : ModifierPoolType.WILD;
      const highestItemTier = heldItems
        .map((m) => m.type.getOrInferTier(poolType))
        .reduce((highestTier, tier) => Math.max(tier!, highestTier), 0); // TODO: is the bang after tier correct?
      const tierHeldItems = heldItems.filter((m) => m.type.getOrInferTier(poolType) === highestItemTier);
      const stolenItem = tierHeldItems[user.randSeedInt(tierHeldItems.length)];
      if (globalScene.tryTransferHeldItemModifier(stolenItem, user, false)) {
        globalScene.queueMessage(
          i18next.t("moveTriggers:stoleItem", {
            pokemonName: getPokemonNameWithAffix(user),
            targetName: getPokemonNameWithAffix(target),
            itemName: stolenItem.type.name,
          }),
        );
      }
    }
    return false;
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
