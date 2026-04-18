import { PostBattleAbAttr } from "#abilities/post-battle-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { PokemonHeldItemModifier } from "#modifier/modifier";
import type { PostBattleAbAttrParams } from "#types/ab-attr-param-types";
import { randSeedItem } from "#utils/random-utils";
import i18next from "i18next";

export class PostBattleLootAbAttr extends PostBattleAbAttr {
  private randItem?: PokemonHeldItemModifier;

  public override apply({ pokemon, simulated }: PostBattleAbAttrParams): void {
    if (simulated) {
      return;
    }

    const { postBattleLoot } = globalScene.currentBattle;
    if (this.randItem == null) {
      this.randItem = randSeedItem(postBattleLoot);
    }

    if (!globalScene.tryTransferHeldItemModifier(this.randItem, pokemon, true, 1, true, undefined, false)) {
      return;
    }
    postBattleLoot.splice(postBattleLoot.indexOf(this.randItem), 1);
    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("abilityTriggers:postBattleLoot", {
        pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
        itemName: this.randItem.type.name,
      }),
    );
  }

  public override canApply({ pokemon, simulated, isVictory }: Parameters<this["apply"]>[0]): boolean {
    const { postBattleLoot } = globalScene.currentBattle;

    if (postBattleLoot.length === 0 || !isVictory) {
      return false;
    }

    this.randItem = randSeedItem(postBattleLoot);
    return globalScene.canTransferHeldItemModifier(this.randItem, pokemon, simulated);
  }
}
