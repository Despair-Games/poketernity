import type Pokemon from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BerryModifier } from "#app/modifier/modifier";
import { BerryModifierType } from "#app/modifier/modifier-type";
import { randSeedInt } from "#app/utils";
import i18next from "i18next";
import { PostTurnAbAttr } from "./post-turn-ab-attr";

/**
 * After the turn ends, try to create an extra item
 * @extends PostTurnAbAttr
 */
export class PostTurnLootAbAttr extends PostTurnAbAttr {
  /**
   * @param itemType - The type of item to create
   * @param procChance - Chance to create an item
   * @see {@linkcode applyPostTurn()}
   */
  constructor(
    /** Extend itemType to add more options */
    private itemType: "EATEN_BERRIES" | "HELD_BERRIES",
    private procChance: (pokemon: Pokemon) => number,
  ) {
    super();
  }

  override applyPostTurn(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    const pass = Phaser.Math.RND.realInRange(0, 1);
    if (Phaser.Math.Clamp(this.procChance(pokemon), 0, 1) < pass) {
      return false;
    }

    if (this.itemType === "EATEN_BERRIES") {
      return this.createEatenBerry(pokemon, simulated);
    } else {
      return false;
    }
  }

  /**
   * Create a new berry chosen randomly from the berries the pokemon ate this battle
   * @param pokemon The pokemon with this ability
   * @param simulated whether the associated ability call is simulated
   * @returns whether a new berry was created
   */
  createEatenBerry(pokemon: Pokemon, simulated: boolean): boolean {
    const berriesEaten = pokemon.battleData.berriesEaten;

    if (!berriesEaten.length) {
      return false;
    }

    if (simulated) {
      return true;
    }

    const randomIdx = randSeedInt(berriesEaten.length);
    const chosenBerryType = berriesEaten[randomIdx];
    const chosenBerry = new BerryModifierType(chosenBerryType);
    berriesEaten.splice(randomIdx); // Remove berry from memory

    const berryModifier = globalScene.findModifier(
      (m) => m instanceof BerryModifier && m.berryType === chosenBerryType,
      pokemon.isPlayer(),
    ) as BerryModifier | undefined;

    if (!berryModifier) {
      const newBerry = new BerryModifier(chosenBerry, pokemon.id, chosenBerryType, 1);
      if (pokemon.isPlayer()) {
        globalScene.addModifier(newBerry);
      } else {
        globalScene.addEnemyModifier(newBerry);
      }
    } else if (berryModifier.stackCount < berryModifier.getMaxHeldItemCount(pokemon)) {
      berryModifier.stackCount++;
    }

    globalScene.queueMessage(
      i18next.t("abilityTriggers:postTurnLootCreateEatenBerry", {
        pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
        berryName: chosenBerry.name,
      }),
    );
    globalScene.updateModifiers(pokemon.isPlayer());

    return true;
  }
}
