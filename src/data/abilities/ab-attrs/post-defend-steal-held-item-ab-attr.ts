import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { Pokemon } from "#field/pokemon";
import type { PokemonHeldItemModifier } from "#modifier/modifier";
import type { Move } from "#moves/move";
import type { PokemonDefendCondition } from "#types/move-types";
import { randSeedItem } from "#utils/random-utils";
import i18next from "i18next";

export class PostDefendStealHeldItemAbAttr extends PostDefendAbAttr {
  private readonly condition: PokemonDefendCondition;

  constructor(condition: PokemonDefendCondition = () => true) {
    super();

    this.condition = condition;
  }

  public override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, _move: Move): void {
    if (simulated) {
      return;
    }

    const heldItems = this.getTargetHeldItems(attacker).filter((i) => i.isTransferable);
    if (heldItems.length > 0) {
      const stolenItem = randSeedItem(heldItems);
      if (globalScene.tryTransferHeldItemModifier(stolenItem, pokemon, false)) {
        globalScene.phaseManager.createAndUnshiftPhase(
          "MessagePhase",
          i18next.t("abilityTriggers:postDefendStealHeldItem", {
            pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
            attackerName: attacker.name,
            stolenItemType: stolenItem.type.name,
          }),
        );
      }
    }
  }

  public override canApply(...[pokemon, , attacker, move]: Parameters<this["apply"]>): boolean {
    if (!move.isAttackMove(attacker, pokemon) || !this.condition(pokemon, attacker, move)) {
      return false;
    }

    return this.getTargetHeldItems(attacker).some((i) => i.isTransferable);
  }

  private getTargetHeldItems(target: Pokemon): PokemonHeldItemModifier[] {
    return globalScene.findModifiers(
      (m) => m.isPokemonHeldItemModifier() && m.pokemonId === target.id,
      target.isPlayer(),
    ) as PokemonHeldItemModifier[];
  }
}
