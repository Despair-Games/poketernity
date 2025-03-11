import type { PokemonDefendCondition } from "#app/@types/PokemonDefendCondition";
import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { PokemonHeldItemModifier } from "#app/modifier/modifier";
import i18next from "i18next";
import { PostDefendAbAttr } from "./post-defend-ab-attr";
import { MoveCategory } from "#enums/move-category";

export class PostDefendStealHeldItemAbAttr extends PostDefendAbAttr {
  private readonly condition?: PokemonDefendCondition;

  constructor(condition?: PokemonDefendCondition) {
    super();

    this.condition = condition;
  }

  override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, move: Move): boolean {
    if (
      !simulated
      && attacker.getMoveCategory(pokemon, move) !== MoveCategory.STATUS
      && (!this.condition || this.condition(pokemon, attacker, move))
    ) {
      const heldItems = this.getTargetHeldItems(attacker).filter((i) => i.isTransferable);
      if (heldItems.length) {
        const stolenItem = heldItems[pokemon.randSeedInt(heldItems.length)];
        if (globalScene.tryTransferHeldItemModifier(stolenItem, pokemon, false)) {
          globalScene.queueMessage(
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
