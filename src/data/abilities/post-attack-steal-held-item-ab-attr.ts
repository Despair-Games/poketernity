import type { PokemonAttackCondition } from "#app/@types/PokemonAttackCondition";
import type Pokemon from "#app/field/pokemon";
import { HitResult } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { PokemonHeldItemModifier } from "#app/modifier/modifier";
import i18next from "i18next";
import type Move from "../move";
import { PostAttackAbAttr } from "./post-attack-ab-attr";

export class PostAttackStealHeldItemAbAttr extends PostAttackAbAttr {
  private stealCondition: PokemonAttackCondition | null;

  constructor(stealCondition?: PokemonAttackCondition) {
    super();

    this.stealCondition = stealCondition ?? null;
  }

  override applyPostAttackAfterMoveTypeCheck(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    defender: Pokemon,
    move: Move,
    hitResult: HitResult,
    _args: any[],
  ): boolean {
    if (
      !simulated
      && hitResult < HitResult.NO_EFFECT
      && (!this.stealCondition || this.stealCondition(pokemon, defender, move))
    ) {
      const heldItems = this.getTargetHeldItems(defender).filter((i) => i.isTransferable);
      if (heldItems.length) {
        const stolenItem = heldItems[pokemon.randSeedInt(heldItems.length)];
        if (globalScene.tryTransferHeldItemModifier(stolenItem, pokemon, false)) {
          globalScene.queueMessage(
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
      (m) => m instanceof PokemonHeldItemModifier && m.pokemonId === target.id,
      target.isPlayer(),
    ) as PokemonHeldItemModifier[];
  }
}
