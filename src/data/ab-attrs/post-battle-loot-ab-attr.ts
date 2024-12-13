import type Pokemon from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { randSeedItem } from "#app/utils";
import i18next from "i18next";
import { PostBattleAbAttr } from "./post-battle-ab-attr";

export class PostBattleLootAbAttr extends PostBattleAbAttr {
  /**
   * @param args - `[0]`: boolean for if the battle ended in a victory
   * @returns `true` if successful
   */
  override applyPostBattle(pokemon: Pokemon, _passive: boolean, simulated: boolean, args: any[]): boolean {
    const postBattleLoot = globalScene.currentBattle.postBattleLoot;
    if (!simulated && postBattleLoot.length && args[0]) {
      const randItem = randSeedItem(postBattleLoot);
      //@ts-ignore - TODO see below
      if (globalScene.tryTransferHeldItemModifier(randItem, pokemon, true, 1, true, undefined, false)) {
        // TODO: fix. This is a promise!?
        postBattleLoot.splice(postBattleLoot.indexOf(randItem), 1);
        globalScene.queueMessage(
          i18next.t("abilityTriggers:postBattleLoot", {
            pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
            itemName: randItem.type.name,
          }),
        );
        return true;
      }
    }

    return false;
  }
}
