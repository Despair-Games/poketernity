import type { Pokemon } from "#app/field/pokemon";
import type { Species } from "#enums/species";
import { EvolutionItem } from "#enums/evolution-item";
import { globalScene } from "#app/global-scene";
import { TimeOfDay } from "#enums/time-of-day";
import { MoveId } from "#enums/move-id";
import { ElementalType } from "#enums/elemental-type";
import type { Gender } from "#enums/gender";

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

export class SpeciesFriendshipEvolutionCondition extends SpeciesEvolutionCondition {
  constructor(friendshipAmount: number) {
    super((p) => p.friendship >= friendshipAmount);
    this.description = "with friendship: " + friendshipAmount;
  }
}
