import { PostAttackAbAttr } from "#abilities/post-attack-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { Pokemon } from "#field/pokemon";
import type { PokemonHeldItemModifier } from "#modifier/modifier";
import type { PostAttackAbAttrParams } from "#types/ab-attr-param-types";
import i18next from "i18next";

export class PostAttackStealHeldItemAbAttr extends PostAttackAbAttr {
  public override apply({ pokemon, simulated, defender }: PostAttackAbAttrParams): void {
    if (simulated) {
      return;
    }

    const heldItems = this.getTargetHeldItems(defender).filter((i) => i.isTransferable);
    if (heldItems.length === 0) {
      return;
    }

    const stolenItem = heldItems[pokemon.randSeedInt(heldItems.length)];
    if (!globalScene.tryTransferHeldItemModifier(stolenItem, pokemon, false)) {
      return;
    }

    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("abilityTriggers:postAttackStealHeldItem", {
        pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
        defenderName: defender.name,
        stolenItemType: stolenItem.type.name,
      }),
    );
  }

  public override canApply({ defender }: Parameters<this["apply"]>[0]): boolean {
    return this.getTargetHeldItems(defender).some((i) => i.isTransferable);
  }

  private getTargetHeldItems(target: Pokemon): PokemonHeldItemModifier[] {
    return globalScene.findModifiers(
      (m) => m.isPokemonHeldItemModifier() && m.pokemonId === target.id,
      target.isPlayer(),
    );
  }
}
