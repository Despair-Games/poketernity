import { PostAttackAbAttr } from "#abilities/post-attack-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { Pokemon } from "#field/pokemon";
import type { PokemonHeldItemModifier } from "#modifier/modifier";
import type { Move } from "#moves/move";
import i18next from "i18next";

export class PostAttackStealHeldItemAbAttr extends PostAttackAbAttr {
  public override apply(pokemon: Pokemon, simulated: boolean, defender: Pokemon, _move: Move): void {
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

  public override canApply(...params: Parameters<this["apply"]>): boolean {
    const [, , defender] = params;
    return this.getTargetHeldItems(defender).some((i) => i.isTransferable);
  }

  private getTargetHeldItems(target: Pokemon): PokemonHeldItemModifier[] {
    return globalScene.findModifiers(
      (m) => m.isPokemonHeldItemModifier() && m.pokemonId === target.id,
      target.isPlayer(),
    ) as PokemonHeldItemModifier[];
  }
}
