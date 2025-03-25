import type { Localizable } from "#app/interfaces/locales";
import type { AbilityId } from "#enums/ability-id";
import { SpeciesId } from "#enums/species-id";
import i18next from "i18next";
import { randSeedGauss, randSeedItem } from "#app/utils";
import type { GrowthRate } from "#enums/growth-rates";
import type { EvolutionLevel } from "#app/data/pokemon-evolutions";
import { pokemonEvolutions } from "#app/data/balance/pokemon-evolutions/init-pokemon-evolutions";
import { pokemonPreEvolutions } from "#app/data/pokemon-pre-evolutions";
import type { ElementalType } from "#enums/elemental-type";
import { variantData } from "#app/data/variant";
import { SpeciesFormKey } from "#enums/species-form-key";
import { SpeciesGroups } from "#enums/pokemon-species-groups";
import { PokemonSpeciesForm } from "#app/data/pokemon-species-form";
import type { PokemonForm } from "#app/data/pokemon-form";
import { getPokemonSpecies } from "#app/utils/pokemon-species-utils";
import type { PokemonSpeciesFilter } from "#app/@types/PokemonSpeciesFilter";

export default class PokemonSpecies extends PokemonSpeciesForm implements Localizable {
  public name: string;
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
    canChangeForm?: boolean,
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
    this.canChangeForm = !!canChangeForm;
    this.forms = forms;

    this.localize();

    forms.forEach((form, f) => {
      form.speciesId = id;
      form.formIndex = f;
      form.generation = generation;
    });
  }

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

  localize(): void {
    this.name = i18next.t(`pokemon:${SpeciesId[this.speciesId].toLowerCase()}`);
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
    if (!pokemonEvolutions.hasOwnProperty(this.speciesId)) {
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
    } else {
      return this.speciesId;
    }
  }

  getPreEvolutionLevels(): EvolutionLevel[] {
    const preEvolutionLevels: EvolutionLevel[] = [];

    const allEvolvingPokemon = Object.keys(pokemonEvolutions);
    for (const p of allEvolvingPokemon) {
      for (const e of pokemonEvolutions[p]) {
        if (
          e.speciesId === this.speciesId
          && (!this.forms.length || !e.evoFormKey || e.evoFormKey === this.forms[this.formIndex].formKey)
          && preEvolutionLevels.every((pe) => pe[0] !== parseInt(p))
        ) {
          const speciesId = parseInt(p) as SpeciesId;
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
    if (pokemonPreEvolutions.hasOwnProperty(this.speciesId)) {
      const preEvolutionLevels = this.getPreEvolutionLevels().reverse();
      const levelDiff = player ? 0 : forTrainer || isBoss ? (forTrainer && isBoss ? 2.5 : 5) : 10;
      ret.push([preEvolutionLevels[0][0], 1]);
      for (let l = 1; l < preEvolutionLevels.length; l++) {
        const evolution = pokemonEvolutions[preEvolutionLevels[l - 1][0]].find(
          (e) => e.speciesId === preEvolutionLevels[l][0],
        );
        ret.push([
          preEvolutionLevels[l][0],
          Math.min(
            Math.max(
              evolution?.enemyEvolveLevel! + Math.round(randSeedGauss(0.5, 1 + levelDiff * 0.2) * 0.5 * 5) - 1,
              2,
              evolution?.enemyEvolveLevel!,
            ),
            currentLevel - 1,
          ),
        ]); // TODO: are those bangs correct?
      }
      const lastPreEvolutionLevel = ret[preEvolutionLevels.length - 1][1];
      const evolution = pokemonEvolutions[preEvolutionLevels[preEvolutionLevels.length - 1][0]].find(
        (e) => e.speciesId === this.speciesId,
      );
      ret.push([
        this.speciesId,
        Math.min(
          Math.max(
            lastPreEvolutionLevel + Math.round(randSeedGauss(0.5, 1 + levelDiff * 0.2) * 0.5 * 5),
            lastPreEvolutionLevel + 1,
            evolution?.enemyEvolveLevel!,
          ),
          currentLevel,
        ),
      ]); // TODO: are those bangs correct?
    } else {
      ret.push([this.speciesId, 1]);
    }

    return ret;
  }

  getCompatibleFusionSpeciesFilter(): PokemonSpeciesFilter {
    const hasEvolution = pokemonEvolutions.hasOwnProperty(this.speciesId);
    const hasPreEvolution = pokemonPreEvolutions.hasOwnProperty(this.speciesId);
    const category = this.group;
    return (species) => {
      return (
        (category !== SpeciesGroups.COMMON
          || (pokemonEvolutions.hasOwnProperty(species.speciesId) === hasEvolution
            && pokemonPreEvolutions.hasOwnProperty(species.speciesId) === hasPreEvolution))
        && species.group === category
        && (this.isTrainerForbidden() || !species.isTrainerForbidden())
        && species.speciesId !== SpeciesId.DITTO
      );
    };
  }

  override isObtainable() {
    return super.isObtainable();
  }

  hasVariants() {
    let variantDataIndex: string | number = this.speciesId;
    if (this.forms.length > 0) {
      const formKey = this.forms[this.formIndex]?.formKey;
      if (formKey) {
        variantDataIndex = `${variantDataIndex}-${formKey}`;
      }
    }
    return variantData.hasOwnProperty(variantDataIndex) || variantData.hasOwnProperty(this.speciesId);
  }

  getFormSpriteKey(formIndex?: number) {
    if (this.forms.length && formIndex !== undefined && formIndex >= this.forms.length) {
      console.warn(
        `Attempted accessing form with index ${formIndex} of species ${this.getName()} with only ${this.forms.length || 0} forms`,
      );
      formIndex = Math.min(formIndex, this.forms.length - 1);
    }
    return this.forms?.length ? this.forms[formIndex || 0].getFormSpriteKey() : "";
  }

  /**
   * Helper function that determines if the game would consider this Pokemon a sublegendary
   * @returns true if the Pokemon is considered a sub-legendary by the game
   */
  isSubLegendary() {
    return [SpeciesGroups.SUBLEGENDARY, SpeciesGroups.ULTRA_BEAST].includes(this.group);
  }

  /**
   * Helper function that determines if the game would consider this Pokemon a legendary
   * @returns true if the Pokemon is considered a legendary by the game
   */
  isLegendary() {
    return this.group === SpeciesGroups.LEGENDARY;
  }

  /**
   * Helper function that determines if the Pokemon is a mythical
   * @returns true if the Pokemon is a mythical
   */
  isMythical() {
    return this.group === SpeciesGroups.MYTHICAL;
  }

  /**
   * Helper function that determines if the Pokemon is a sublegendary, legendary, or mythical
   * @returns `true` if the Pokemon is a sublegendary, legendary, or mythical
   */
  isLegendLike() {
    return this.isSubLegendary() || this.isLegendary() || this.isMythical();
  }
}
