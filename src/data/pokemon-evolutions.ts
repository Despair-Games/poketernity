import type { Pokemon } from "#app/field/pokemon";
import type { Species } from "#enums/species";
import { EvolutionItem } from "#enums/evolution-item";

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
}

export class SpeciesEvolutionCondition {
  public predicate: EvolutionConditionPredicate;

  constructor(predicate: EvolutionConditionPredicate) {
    this.predicate = predicate;
  }
}

export class SpeciesFriendshipEvolutionCondition extends SpeciesEvolutionCondition {
  constructor(friendshipAmount: number, predicate?: EvolutionConditionPredicate) {
    super((p) => p.friendship >= friendshipAmount && (!predicate || predicate(p)));
  }
}
