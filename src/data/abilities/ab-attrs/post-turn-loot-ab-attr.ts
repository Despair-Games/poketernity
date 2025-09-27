import { PostTurnAbAttr } from "#abilities/post-turn-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { Pokemon } from "#field/pokemon";
import { BerryModifier } from "#modifier/modifier";
import { BerryModifierType } from "#modifier/modifier-type";
import { clamp } from "#utils/common-utils";
import { randSeedInt } from "#utils/random-utils";
import i18next from "i18next";

/**
 * After the turn ends, try to create an extra item
 * @param itemType - The type of item to create
 * @param procChance - Chance to create an item
 */
export class PostTurnLootAbAttr extends PostTurnAbAttr {
  /** @todo The `HELD_BERRIES` option is unsupported and never used */
  private readonly itemType: "EATEN_BERRIES" | "HELD_BERRIES";
  private readonly procChance: (pokemon: Pokemon) => number;

  constructor(itemType: "EATEN_BERRIES" | "HELD_BERRIES", procChance: (pokemon: Pokemon) => number) {
    super();

    this.itemType = itemType;
    this.procChance = procChance;
  }

  public override apply(pokemon: Pokemon, simulated: boolean): boolean {
    if (this.itemType === "EATEN_BERRIES") {
      return this.createEatenBerry(pokemon, simulated);
    }
    return false;
  }

  /** @todo This can check item usage more thoroughly when modifier bullshit is sorted out */
  public override canApply(...[pokemon]: Parameters<this["apply"]>): boolean {
    const pass = Phaser.Math.RND.realInRange(0, 1);
    if (clamp(this.procChance(pokemon), 0, 1) < pass) {
      return false;
    }

    const berriesEaten = pokemon.waveData.berriesEaten;
    return berriesEaten.length > 0;
  }

  /**
   * Create a new berry chosen randomly from the berries the pokemon ate this battle
   * @param pokemon The pokemon with this ability
   * @param simulated whether the associated ability call is simulated
   * @returns whether a new berry was created
   */
  createEatenBerry(pokemon: Pokemon, simulated: boolean): boolean {
    const berriesEaten = pokemon.waveData.berriesEaten;

    if (berriesEaten.length === 0) {
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
      (m) => m.isBerryModifier() && m.berryType === chosenBerryType,
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

    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("abilityTriggers:postTurnLootCreateEatenBerry", {
        pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
        berryName: chosenBerry.name,
      }),
    );
    globalScene.updateModifiers(pokemon.isPlayer());

    return true;
  }
}
