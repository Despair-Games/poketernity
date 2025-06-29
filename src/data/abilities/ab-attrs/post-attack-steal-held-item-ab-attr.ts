import { PostAttackAbAttr } from "#abilities/post-attack-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { Pokemon } from "#field/pokemon";
import type { PokemonHeldItemModifier } from "#modifier/modifier";
import type { Move } from "#moves/move";
import type { PokemonAttackCondition } from "#types/pokemon-attack-condition";
import i18next from "i18next";

export class PostAttackStealHeldItemAbAttr extends PostAttackAbAttr {
  private readonly stealCondition?: PokemonAttackCondition;

  constructor(stealCondition?: PokemonAttackCondition) {
    super();

    this.stealCondition = stealCondition;
  }

  public override applyPostAttack(pokemon: Pokemon, simulated: boolean, defender: Pokemon, move: Move): boolean {
    if (!simulated && (!this.stealCondition || this.stealCondition(pokemon, defender, move))) {
      const heldItems = this.getTargetHeldItems(defender).filter((i) => i.isTransferable);
      if (heldItems.length) {
        const stolenItem = heldItems[pokemon.randSeedInt(heldItems.length)];
        if (globalScene.tryTransferHeldItemModifier(stolenItem, pokemon, false)) {
          globalScene.phaseManager.createAndUnshiftPhase(
            "MessagePhase",
            i18next.t("abilityTriggers:postAttackStealHeldItem", {
              pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
              defenderName: defender.name,
              stolenItemType: stolenItem.type.name,
            }),
          );
          return true;
        }
      }
    }
    return false;
  }

  getTargetHeldItems(target: Pokemon): PokemonHeldItemModifier[] {
    return globalScene.findModifiers(
      (m) => m.isPokemonHeldItemModifier() && m.pokemonId === target.id,
      target.isPlayer(),
    ) as PokemonHeldItemModifier[];
  }
}
