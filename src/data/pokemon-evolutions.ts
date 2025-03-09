import type { Pokemon } from "#app/field/pokemon";
import type { Species } from "#enums/species";
import { EvolutionItem } from "#enums/evolution-item";
import { globalScene } from "#app/global-scene";
import { TimeOfDay } from "#enums/time-of-day";
import { MoveId } from "#enums/move-id";
import { ElementalType } from "#enums/elemental-type";
import type { Gender } from "#enums/gender";
import { randSeedInt } from "#app/utils";
import { PokeballType } from "#enums/pokeball";
import { WeatherType } from "#enums/weather-type";
import type { Biome } from "#enums/biome";
import { Nature } from "#enums/nature";

/**
 * Pokemon Evolution tuple type consisting of:
 * @property 0 {@linkcode Species} The species of the Pokemon.
 * @property 1 The level at which the Pokemon evolves.
 */
export type EvolutionLevel = [species: Species, level: number];

export type EvolutionConditionPredicate = (p: Pokemon) => boolean;

export interface PokemonEvolutions {
  [key: string]: SpeciesFormEvolution[];
}
export interface PokemonPreEvolutions {
  [key: string]: Species;
}

export class SpeciesFormEvolution {
  public speciesId: Species;
  public preFormKey: string | null;
  public evoFormKey: string | null;
  public level: number;
  public item: EvolutionItem | null;
  public condition: SpeciesEvolutionCondition | null;
  public enemyEvolveLevel: number;

  /**
   * @param speciesId The ID of the species that the Pokemon will evolve into.
   * @param preFormKey The form key that a Pokemon must have before being eligible for this evolution.
   * @param evoFormKey The form key for the form that the Pokemon will evolve into.
   * @param level The minimum level that a Pokemon must have for this evolution.
   * @param item If applicable, the evolution item that the Pokemon must use for this evolution.
   * @param condition If applicable, an extra condition that the Pokemon must satisfy for this evolution.
   * @param enemyEvolveLevel The level at which enemy spawns will undergo this evolution. Default: Equal to `level`.
   */
  constructor(
    speciesId: Species,
    preFormKey: string | null,
    evoFormKey: string | null,
    level: number,
    item: EvolutionItem | null,
    condition: SpeciesEvolutionCondition | null,
    enemyEvolveLevel: number = level,
  ) {
    this.speciesId = speciesId;
    this.preFormKey = preFormKey;
    this.evoFormKey = evoFormKey;
    this.level = level;
    this.item = item || EvolutionItem.NONE;
    this.condition = condition;
    this.enemyEvolveLevel = enemyEvolveLevel;
  }
}

export class SpeciesEvolution extends SpeciesFormEvolution {
  constructor(
    speciesId: Species,
    level: number,
    item: EvolutionItem | null,
    condition: SpeciesEvolutionCondition | null,
    enemyEvolveLevel: number = level,
  ) {
    super(speciesId, null, null, level, item, condition, enemyEvolveLevel);
  }
  // Todo: return level or item along with condition descriptions
}

export class SpeciesEvolutionCondition {
  public predicate: EvolutionConditionPredicate;
  // TODO: Use localization instead of hardcoded strings
  public description: string = "";

  constructor(predicate: EvolutionConditionPredicate) {
    this.predicate = predicate;
  }
}

// TODO: Break this up into a MaleCondition and FemaleCondition?
export class GenderEvolutionCondition extends SpeciesEvolutionCondition {
  constructor(requiredGender: Gender) {
    super((p) => p.gender === requiredGender);
    this.description = "requires gender";
  }
}

export class DayEvolutionCondition extends SpeciesEvolutionCondition {
  constructor() {
    super(() => globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY]));
    this.description = "during Dawn or Day";
  }
}

export class NightEvolutionCondition extends SpeciesEvolutionCondition {
  constructor() {
    super(() => globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT]));
    this.description = "during Dusk or Night";
  }
}

/**
 * Used for Espeon, Roselia, and Riolu
 */
export class FriendshipAndDayCondition extends SpeciesEvolutionCondition {
  constructor(friendshipAmount: number) {
    super((p) => p.friendship >= friendshipAmount && globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY]));
    this.description = "with friendship during Dawn or Day";
  }
}

/**
 * Used for Umbreon and Chimeco
 */
export class FriendshipAndNightCondition extends SpeciesEvolutionCondition {
  constructor(friendshipAmount: number) {
    super((p) => p.friendship >= friendshipAmount && globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT]));
    this.description = "with friendship during Dusk or Night";
  }
}

/**
 * Mime Jr has a regional evo based on time of day
 */
export class MrMimeCondition extends SpeciesEvolutionCondition {
  constructor(forGalar: boolean) {
    if (forGalar) {
      super(
        (p) =>
          p.moveset.filter((m) => m.moveId === MoveId.MIMIC).length > 0
          && globalScene.arena.isTimeOfDay([TimeOfDay.DUSK, TimeOfDay.NIGHT]),
      );
      this.description = "knowing mimic during dusk or night";
    } else {
      super(
        (p) =>
          p.moveset.filter((m) => m.moveId === MoveId.MIMIC).length > 0
          && globalScene.arena.isTimeOfDay([TimeOfDay.DAWN, TimeOfDay.DAY]),
      );
      this.description = "knowing mimic during dawn or day";
    }
  }
}

/** Sylveon requires high friendship and knowing a fairy type move */
export class SylveonEvoCondition extends SpeciesEvolutionCondition {
  constructor(friendshipAmount: number) {
    super(
      (p) => p.friendship >= friendshipAmount && !!p.getMoveset().find((m) => m.getMove().type === ElementalType.FAIRY),
    );
    this.description = "with high friendship and knowing a Fairy type move";
  }
}

export class KnowMoveEvoCondition extends SpeciesEvolutionCondition {
  constructor(requiredMoveId: MoveId) {
    super((p) => p.moveset.filter((m) => m.moveId === requiredMoveId).length > 0);
    // Todo: find efficient way to get from Move.MoveId to Move.name
    this.description = "needs to know " + requiredMoveId;
  }
}

/** Dudunsparce has a 1/100 chance of being 3 segments on evolution */
export class DudunsparceThreeSegmentEvoCondition extends SpeciesEvolutionCondition {
  constructor(requiredMoveId: MoveId) {
    super((p) => {
      let ret = false;
      if (p.moveset.filter((m) => m.moveId === requiredMoveId).length > 0) {
        globalScene.executeWithSeedOffset(() => (ret = !randSeedInt(100)), p.id);
      }
      return ret;
    });
    this.description = "needs to know hypder drill and has a 1% of happening";
  }
}

/** Requires the player to have owned a certain species
 *
 * Used for Mantine (Remoraid)
 * Escavalier (Karrablast)
 * Accelgor (Shelmet)
 */
export class SpeciesOwnedEvoCondition extends SpeciesEvolutionCondition {
  constructor(requiredSpecies: Species) {
    super(() => !!globalScene.gameData.dexData[requiredSpecies].caughtAttr);
    // Todo: find efficient way to get species name from Species
    this.description = "requires owning " + requiredSpecies;
  }
}

/**
 * Shedinja is created if the player has an empty slot in the party and at least 1 Pokeball
 * Note that this is specifically a Pokeball. No other balls work.
 */
export class ShedinjaEvoCondition extends SpeciesEvolutionCondition {
  constructor() {
    super(() => globalScene.getPlayerParty().length < 6 && globalScene.pokeballCounts[PokeballType.POKEBALL] > 0);
    this.description = "Have an empty slot in the party and a Pokeball";
  }
}

/**
 * Requires knowing Wave Crash instead of surviving 294 recoil damage
 * Basculegion has different male and female forms
 */
export class BasculegionEvoCondition extends SpeciesEvolutionCondition {
  constructor(requiredMoveId: MoveId, requiredGender: Gender) {
    super((p) => p.moveset.filter((m) => m.moveId === requiredMoveId).length > 0 && p.gender === requiredGender);
    // Todo: convert MoveId and Gender into readable strings
    this.description = "Needs " + requiredMoveId + " and be: " + requiredGender;
  }
}

/**
 * Low key Toxtricity requires a specific nature.
 * All other natures result in amped form
 */
export class LowKeyToxtricityEvoCondition extends SpeciesEvolutionCondition {
  constructor() {
    super(
      (p) =>
        [
          Nature.LONELY,
          Nature.BOLD,
          Nature.RELAXED,
          Nature.TIMID,
          Nature.SERIOUS,
          Nature.MODEST,
          Nature.MILD,
          Nature.QUIET,
          Nature.BASHFUL,
          Nature.CALM,
          Nature.GENTLE,
          Nature.CAREFUL,
        ].indexOf(p.getNature()) > -1,
    );
    this.description =
      "Requires lonely, bold, relaxed, timid, serious, modest, mild, quiet, bashful, calm, gentle, or careful nature";
  }
}

/**
 * Sliggoo and Hisui Sliggoo require it to be raining or foggy to evolve
 */
export class GoodraEvoCondition extends SpeciesEvolutionCondition {
  constructor() {
    super(() => globalScene.arena.hasWeather([WeatherType.RAIN, WeatherType.FOG, WeatherType.HEAVY_RAIN]));
    this.description = "requires rain or fog";
  }
}

/**
 * Only used for Alcremie forms
 */
export class BiomeEvoCondition extends SpeciesEvolutionCondition {
  constructor(requiredBiomes: Biome[]) {
    super(() => globalScene.arena.isInBiome(requiredBiomes));
    this.description = "Needs to be in certain biomes";
  }
}

/** Tandemous has a 1/100 chance of being a family of 3 on evolution */
export class TandemausFamilyOfThreeEvoCondition extends SpeciesEvolutionCondition {
  constructor() {
    super((p) => {
      let ret = false;
      globalScene.executeWithSeedOffset(() => (ret = !randSeedInt(100)), p.id);
      return ret;
    });
    this.description = "has a 1% of happening";
  }
}

/** Custom evo method requires grabbing 9 or more money items */
export class GholdengoEvoCondition extends SpeciesEvolutionCondition {
  constructor() {
    super(
      (p) =>
        p.evoCounter
          + p.getHeldItems().filter((m) => m.isDamageMoneyRewardModifier()).length
          + globalScene.findModifiers(
            (m) => m.isMoneyMultiplierModifier() || m.isExtraModifierModifier() || m.isTempExtraModifierModifier(),
          ).length
        > 9,
    );
    this.description = "Get 9 or more money items";
  }
}

/**
 * For evolutions that require friendship
 */
export class SpeciesFriendshipEvolutionCondition extends SpeciesEvolutionCondition {
  constructor(friendshipAmount: number) {
    super((p) => p.friendship >= friendshipAmount);
    this.description = "with friendship: " + friendshipAmount;
  }
}
