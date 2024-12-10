import type { PokemonDefendCondition } from "#app/@types/PokemonDefendCondition";
import type Pokemon from "#app/field/pokemon";
import { HitResult } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { PokemonHeldItemModifier } from "#app/modifier/modifier";
import i18next from "i18next";
import type Move from "../move";
import { PostDefendAbAttr } from "./post-defend-ab-attr";

export class PostDefendStealHeldItemAbAttr extends PostDefendAbAttr {
  private condition?: PokemonDefendCondition;

  constructor(condition?: PokemonDefendCondition) {
    super();

    this.condition = condition;
  }

  override applyPostDefend(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    attacker: Pokemon,
    move: Move,
    hitResult: HitResult,
    _args: any[],
  ): boolean {
    if (
      !simulated
      && hitResult < HitResult.NO_EFFECT
      && (!this.condition || this.condition(pokemon, attacker, move))
      && !move.hitsSubstitute(attacker, pokemon)
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
      (m) => m instanceof PokemonHeldItemModifier && m.pokemonId === target.id,
      target.isPlayer(),
    ) as PokemonHeldItemModifier[];
  }
}
