import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { MoveCategory } from "#enums/move-category";
import type { Pokemon } from "#field/pokemon";
import type { PokemonHeldItemModifier } from "#modifier/modifier";
import type { Move } from "#moves/move";
import type { PokemonDefendCondition } from "#types/pokemon-defend-condition";
import i18next from "i18next";

export class PostDefendStealHeldItemAbAttr extends PostDefendAbAttr {
  private readonly condition?: PokemonDefendCondition;

  constructor(condition?: PokemonDefendCondition) {
    super();

    this.condition = condition;
  }

  public override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, move: Move): boolean {
    if (
      !simulated
      && attacker.getMoveCategory(pokemon, move) !== MoveCategory.STATUS
      && (!this.condition || this.condition(pokemon, attacker, move))
    ) {
      const heldItems = this.getTargetHeldItems(attacker).filter((i) => i.isTransferable);
      if (heldItems.length) {
        const stolenItem = heldItems[pokemon.randSeedInt(heldItems.length)];
        if (globalScene.tryTransferHeldItemModifier(stolenItem, pokemon, false)) {
          globalScene.phaseManager.queueMessagePhase(
            i18next.t("abilityTriggers:postDefendStealHeldItem", {
              pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
              attackerName: attacker.name,
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
