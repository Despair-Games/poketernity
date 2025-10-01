import type { EvolutionLevel } from "#data/pokemon-evolutions";
import type { PokemonForm } from "#data/pokemon-form";
import { pokemonPreEvolutions } from "#data/pokemon-pre-evolutions";
import { PokemonSpeciesForm } from "#data/pokemon-species-form";
import { variantData } from "#data/variant";
import type { AbilityId } from "#enums/ability-id";
import type { ElementalType } from "#enums/elemental-type";
import type { GrowthRate } from "#enums/growth-rate";
import { SpeciesFormKey } from "#enums/species-form-key";
import { SpeciesGroups } from "#enums/species-groups";
import { SpeciesId } from "#enums/species-id";
import { pokemonEvolutions } from "#init/init-pokemon-evolutions";
import type { PokemonSpeciesFilter } from "#types/ui-types";
import { getPokemonSpecies } from "#utils/pokemon-utils";
import { randSeedGauss, randSeedItem } from "#utils/random-utils";
import i18next from "i18next";

export class PokemonSpecies extends PokemonSpeciesForm {
  readonly group: SpeciesGroups;
  readonly species: string;
  readonly growthRate: GrowthRate;
  readonly malePercent: number | null;
  override readonly genderDiffs: boolean;
  readonly canChangeForm: boolean;
  readonly forms: PokemonForm[];

  constructor(
    id: SpeciesId,
    generation: number,
    group: SpeciesGroups,
    type1: ElementalType,
    type2: ElementalType | null,
    height: number,
    weight: number,
    ability1: AbilityId,
    ability2: AbilityId,
    abilityHidden: AbilityId,
    baseTotal: number,
    baseHp: number,
    baseAtk: number,
    baseDef: number,
    baseSpatk: number,
    baseSpdef: number,
    baseSpd: number,
    catchRate: number,
    baseFriendship: number,
    baseExp: number,
    growthRate: GrowthRate,
    malePercent: number | null,
    genderDiffs: boolean,
    canChangeForm: boolean = false,
    ...forms: PokemonForm[]
  ) {
    super(
      type1,
      type2,
      height,
      weight,
      ability1,
      ability2,
      abilityHidden,
      baseTotal,
      baseHp,
      baseAtk,
      baseDef,
      baseSpatk,
      baseSpdef,
      baseSpd,
      catchRate,
      baseFriendship,
      baseExp,
      genderDiffs,
      false,
    );
    this.type = "PokemonSpecies";
    this.speciesId = id;
    this.formIndex = 0;
    this.generation = generation;
    this.group = group;
    this.growthRate = growthRate;
    this.malePercent = malePercent;
    this.genderDiffs = genderDiffs;
    this.canChangeForm = canChangeForm;
    this.forms = forms;

    forms.forEach((form, f) => {
      form.speciesId = id;
      form.formIndex = f;
      form.generation = generation;
    });
  }

  /**
   * The localized name of the Pokemon species (in its base form).
   * For the name of a specific form, use {@linkcode getName} instead.
   */
  public get name(): string {
    return i18next.t(`pokemon:${SpeciesId[this.speciesId].toLowerCase()}`);
  }

  /**
   * @param formIndex - (Optional) The index of the {@linkcode forms | form}
   * from which the name is obtained. If not defined, this uses the base form.
   * @returns The localized name of the Pokemon species under the given form index
   */
  getName(formIndex?: number): string {
    if (formIndex !== undefined && this.forms.length) {
      const form = this.forms[formIndex];
      let key: string | null;
      switch (form.formKey) {
        case SpeciesFormKey.MEGA:
        case SpeciesFormKey.PRIMAL:
        case SpeciesFormKey.ETERNAMAX:
        case SpeciesFormKey.MEGA_X:
        case SpeciesFormKey.MEGA_Y:
          key = form.formKey;
          break;
        default:
          if (form.formKey.indexOf(SpeciesFormKey.GIGANTAMAX) > -1) {
            key = "gigantamax";
          } else {
            key = null;
          }
      }

      if (key) {
        return i18next.t(`battlePokemonForm:${key}`, { pokemonName: this.name });
      }
    }
    return this.name;
  }

  /**
   * Calculates the correct evolution stage for an enemy Pokemon, applying pre-evolutions
   * and evolutions as necessary based on the Pokemon's level.
   * @param level The level of the Pokemon.
   * @param forTrainer Whether or not this Pokemon belongs to an enemy trainer (as opposed to being a wild Pokemon). Default: `false`.
   * @returns The {@linkcode SpeciesId | species ID} of the desired evolution stage.
   */
  getEnemySpeciesForLevel(level: number, forTrainer: boolean = false): SpeciesId {
    // Apply pre-evolutions
    const preEvolutionLevels = this.getPreEvolutionLevels();
    if (preEvolutionLevels.length) {
      for (let pl = preEvolutionLevels.length - 1; pl >= 0; pl--) {
        const preEvolutionLevel = preEvolutionLevels[pl];
        if (level < preEvolutionLevel[1]) {
          return preEvolutionLevel[0];
        }
      }
    }

    // If the species cannot evolve, we are done
    if (!Object.hasOwn(pokemonEvolutions, this.speciesId)) {
      return this.speciesId;
    }

    // Apply evolutions
    const evolutions = pokemonEvolutions[this.speciesId];
    const eligibleEvolutions: SpeciesId[] = [];

    for (const ev of evolutions) {
      // TODO: Should enemy Pokemon have a random chance of evolving if they are close to the level threshold?
      if (level < ev.enemyEvolveLevel) {
        continue;
      }

      const evolutionSpecies = getPokemonSpecies(ev.speciesId);
      const isRegionalEvolution = !this.isRegional() && evolutionSpecies.isRegional();

      // Random non-trainer spawns are not eligible for regional evolutions (e.g. Alolan Raichu)
      if (forTrainer || !isRegionalEvolution) {
        eligibleEvolutions.push(ev.speciesId);
      }
    }

    if (eligibleEvolutions.length > 0) {
      const randSpecies = randSeedItem(eligibleEvolutions);
      return getPokemonSpecies(randSpecies).getEnemySpeciesForLevel(level, forTrainer);
    }
    return this.speciesId;
  }

  getPreEvolutionLevels(): EvolutionLevel[] {
    const preEvolutionLevels: EvolutionLevel[] = [];

    const allEvolvingPokemon = Object.keys(pokemonEvolutions);
    for (const p of allEvolvingPokemon) {
      for (const e of pokemonEvolutions[p]) {
        if (
          e.speciesId === this.speciesId
          && (!this.forms.length || !e.evoFormKey || e.evoFormKey === this.forms[this.formIndex].formKey)
          && preEvolutionLevels.every((pe) => pe[0] !== Number.parseInt(p, 10))
        ) {
          const speciesId = Number.parseInt(p, 10) as SpeciesId;
          const level = e.enemyEvolveLevel;
          preEvolutionLevels.push([speciesId, level]);
          const subPreEvolutionLevels = getPokemonSpecies(speciesId).getPreEvolutionLevels();
          for (const spl of subPreEvolutionLevels) {
            preEvolutionLevels.push(spl);
          }
        }
      }
    }

    return preEvolutionLevels;
  }

  // TODO: This could definitely be written better and more accurate to the getEnemySpeciesForLevel logic, but it is only for generating movesets for evolved Pokemon
  getSimulatedEvolutionChain(
    currentLevel: number,
    forTrainer: boolean = false,
    isBoss: boolean = false,
    player: boolean = false,
  ): EvolutionLevel[] {
    const ret: EvolutionLevel[] = [];
    if (Object.hasOwn(pokemonPreEvolutions, this.speciesId)) {
      const preEvolutionLevels = this.getPreEvolutionLevels().reverse();
      let levelDiff: number = 10;
      if (player) {
        levelDiff = 0;
      } else if (forTrainer && isBoss) {
        levelDiff = 2.5;
      } else if (forTrainer || isBoss) {
        levelDiff = 5;
      }
      ret.push([preEvolutionLevels[0][0], 1]);
      for (let l = 1; l < preEvolutionLevels.length; l++) {
        const evolution = pokemonEvolutions[preEvolutionLevels[l - 1][0]].find(
          (e) => e.speciesId === preEvolutionLevels[l][0],
        )!; // TODO: resolve `!`
        ret.push([
          preEvolutionLevels[l][0],
          Math.min(
            Math.max(
              evolution.enemyEvolveLevel + Math.round(randSeedGauss(0.5, 1 + levelDiff * 0.2) * 0.5 * 5) - 1,
              2,
              evolution.enemyEvolveLevel,
            ),
            currentLevel - 1,
          ),
        ]);
      }
      const lastPreEvolutionLevel = ret[preEvolutionLevels.length - 1][1];
      const evolution = pokemonEvolutions[preEvolutionLevels.at(-1)![0]].find((e) => e.speciesId === this.speciesId)!; // TODO: resolve `!` on `.find()`
      ret.push([
        this.speciesId,
        Math.min(
          Math.max(
            lastPreEvolutionLevel + Math.round(randSeedGauss(0.5, 1 + levelDiff * 0.2) * 0.5 * 5),
            lastPreEvolutionLevel + 1,
            evolution.enemyEvolveLevel,
          ),
          currentLevel,
        ),
      ]);
    } else {
      ret.push([this.speciesId, 1]);
    }

    return ret;
  }

  getCompatibleFusionSpeciesFilter(): PokemonSpeciesFilter {
    const hasEvolution = Object.hasOwn(pokemonEvolutions, this.speciesId);
    const hasPreEvolution = Object.hasOwn(pokemonPreEvolutions, this.speciesId);
    const category = this.group;
    return (species) => {
      return (
        (category !== SpeciesGroups.COMMON
          || (Object.hasOwn(pokemonEvolutions, species.speciesId) === hasEvolution
            && Object.hasOwn(pokemonPreEvolutions, species.speciesId) === hasPreEvolution))
        && species.group === category
        && (this.isTrainerForbidden() || !species.isTrainerForbidden())
        && species.speciesId !== SpeciesId.DITTO
      );
    };
  }

  hasVariants(): boolean {
    let variantDataIndex: string | number = this.speciesId;
    if (this.forms.length > 0) {
      const formKey = this.forms[this.formIndex]?.formKey;
      if (formKey) {
        variantDataIndex = `${variantDataIndex}-${formKey}`;
      }
    }
    return Object.hasOwn(variantData, variantDataIndex) || Object.hasOwn(variantData, this.speciesId);
  }

  getFormSpriteKey(formIndex: number = 0): string {
    if (this.forms.length > 0 && formIndex >= this.forms.length) {
      console.warn(
        `Attempted accessing form with index ${formIndex} of species ${this.getName()} with only ${this.forms.length} forms`,
      );
      formIndex = Math.min(formIndex, this.forms.length - 1);
    }
    return this.forms[formIndex]?.getFormSpriteKey() ?? "";
  }

  /**
   * @returns Whether the Pokemon is "sub-legendary" (includes Ultra Beasts)
   * @see {@link https://www.serebii.net/pokemon/legendary.shtml}
   */
  isSubLegendary(): boolean {
    return ([SpeciesGroups.SUBLEGENDARY, SpeciesGroups.ULTRA_BEAST] as SpeciesGroups[]).includes(this.group);
  }

  /**
   * @returns Whether the Pokemon is legendary
   * @see {@link https://bulbapedia.bulbagarden.net/wiki/Legendary_Pok%C3%A9mon}
   */
  isLegendary(): boolean {
    return this.group === SpeciesGroups.LEGENDARY;
  }

  /**
   * @returns Whether the Pokemon is mythical
   * @see {@link https://bulbapedia.bulbagarden.net/wiki/Mythical_Pok%C3%A9mon}
   */
  isMythical(): boolean {
    return this.group === SpeciesGroups.MYTHICAL;
  }

  /**
   * @returns Whether the Pokemon is sub-legendary / an Ultra Beast, legendary, or mythical
   */
  isLegendLike(): boolean {
    return this.isSubLegendary() || this.isLegendary() || this.isMythical();
  }
}
