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
export type EvolutionConditionEnforceFunc = (p: Pokemon) => void;

export class SpeciesFormEvolution {
  public speciesId: Species;
  public preFormKey: string | null;
  public evoFormKey: string | null;
  public level: number;
  public item: EvolutionItem | null;
  public condition: SpeciesEvolutionCondition | null;
  /** A numerical level for Pokemon that don't evolve with level
   * Is 0 if it is a level evolution
   */
  public altLevel: number;

  constructor(
    speciesId: Species,
    preFormKey: string | null,
    evoFormKey: string | null,
    level: number,
    item: EvolutionItem | null,
    condition: SpeciesEvolutionCondition | null,
    altLevel: number = 0,
  ) {
    this.speciesId = speciesId;
    this.preFormKey = preFormKey;
    this.evoFormKey = evoFormKey;
    this.level = level;
    this.item = item || EvolutionItem.NONE;
    this.condition = condition;
    this.altLevel = altLevel;
  }
}

export class SpeciesEvolution extends SpeciesFormEvolution {
  constructor(
    speciesId: Species,
    level: number,
    item: EvolutionItem | null,
    condition: SpeciesEvolutionCondition | null,
    altLevel: number = 0,
  ) {
    super(speciesId, null, null, level, item, condition, altLevel);
  }
}

export class SpeciesEvolutionCondition {
  public predicate: EvolutionConditionPredicate;
  public enforceFunc: EvolutionConditionEnforceFunc | undefined;

  constructor(predicate: EvolutionConditionPredicate, enforceFunc?: EvolutionConditionEnforceFunc) {
    this.predicate = predicate;
    this.enforceFunc = enforceFunc;
  }
}

export class SpeciesFriendshipEvolutionCondition extends SpeciesEvolutionCondition {
  constructor(
    friendshipAmount: number,
    predicate?: EvolutionConditionPredicate,
    enforceFunc?: EvolutionConditionEnforceFunc,
  ) {
    super((p) => p.friendship >= friendshipAmount && (!predicate || predicate(p)), enforceFunc);
  }
}

export interface PokemonEvolutions {
  [key: string]: SpeciesFormEvolution[];
}
