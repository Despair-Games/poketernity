import type { Localizable } from "#app/interfaces/locales";
import type { Abilities } from "#enums/abilities";
import { PartyMemberStrength } from "#enums/party-member-strength";
import { Species } from "#enums/species";
import i18next from "i18next";
import type { GameMode } from "#app/game-mode";
import { randSeedInt, randSeedGauss } from "#app/utils";
import type { GrowthRate } from "#enums/growth-rates";
import type { EvolutionLevel } from "#app/data/balance/pokemon-evolutions";
import { pokemonEvolutions, pokemonPrevolutions } from "#app/data/balance/pokemon-evolutions";
import { SpeciesWildEvolutionDelay } from "#enums/species-wild-evolution-delay";
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
    id: Species,
    generation: number,
    group: SpeciesGroups,
    type1: ElementalType,
    type2: ElementalType | null,
    height: number,
    weight: number,
    ability1: Abilities,
    ability2: Abilities,
    abilityHidden: Abilities,
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
    this.name = i18next.t(`pokemon:${Species[this.speciesId].toLowerCase()}`);
  }

  getWildSpeciesForLevel(level: number, allowEvolving: boolean, isBoss: boolean, gameMode: GameMode): Species {
    return this.getSpeciesForLevel(
      level,
      allowEvolving,
      false,
      (isBoss ? PartyMemberStrength.WEAKER : PartyMemberStrength.AVERAGE) + (gameMode?.isEndless ? 1 : 0),
    );
  }

  getTrainerSpeciesForLevel(
    level: number,
    allowEvolving: boolean = false,
    strength: PartyMemberStrength,
    currentWave: number = 0,
  ): Species {
    return this.getSpeciesForLevel(level, allowEvolving, true, strength, currentWave);
  }

  /**
   * @see {@linkcode getSpeciesForLevel} uses an ease in and ease out sine function:
   * @see {@link https://easings.net/#easeInSine}
   * @see {@link https://easings.net/#easeOutSine}
   * Ease in is similar to an exponential function with slower growth, as in, x is directly related to y, and increase in y is higher for higher x.
   * Ease out looks more similar to a logarithmic function shifted to the left. It's still a direct relation but it plateaus instead of increasing in growth.
   *
   * This function is used to calculate the x given to these functions, which is used for evolution chance.
   *
   * First is maxLevelDiff, which is a denominator for evolution chance for mons without wild evolution delay.
   * This means a lower value of x will lead to a higher evolution chance.
   *
   * It's also used for preferredMinLevel, which is used when an evolution delay exists.
   * The calculation with evolution delay is a weighted average of the easeIn and easeOut functions where preferredMinLevel is the denominator.
   * This also means a lower value of x will lead to a higher evolution chance.
   * @param strength {@linkcode PartyMemberStrength} The strength of the party member in question
   * @returns The level difference from expected evolution level tolerated for a mon to be unevolved. Lower value = higher evolution chance.
   */
  private getStrengthLevelDiff(strength: PartyMemberStrength): number {
    switch (Math.min(strength, PartyMemberStrength.STRONGER)) {
      case PartyMemberStrength.WEAKEST:
        return 60;
      case PartyMemberStrength.WEAKER:
        return 40;
      case PartyMemberStrength.WEAK:
        return 20;
      case PartyMemberStrength.AVERAGE:
        return 8;
      case PartyMemberStrength.STRONG:
        return 4;
      default:
        return 0;
    }
  }

  getSpeciesForLevel(
    level: number,
    allowEvolving: boolean = false,
    forTrainer: boolean = false,
    strength: PartyMemberStrength = PartyMemberStrength.WEAKER,
    currentWave: number = 0,
  ): Species {
    const prevolutionLevels = this.getPrevolutionLevels();

    if (prevolutionLevels.length) {
      for (let pl = prevolutionLevels.length - 1; pl >= 0; pl--) {
        const prevolutionLevel = prevolutionLevels[pl];
        if (level < prevolutionLevel[1]) {
          return prevolutionLevel[0];
        }
      }
    }

    if (!allowEvolving || !pokemonEvolutions.hasOwnProperty(this.speciesId)) {
      return this.speciesId;
    }

    const evolutions = pokemonEvolutions[this.speciesId];

    const easeInFunc = Phaser.Tweens.Builders.GetEaseFunction("Sine.easeIn");
    const easeOutFunc = Phaser.Tweens.Builders.GetEaseFunction("Sine.easeOut");

    const evolutionPool: Map<number, Species> = new Map();
    let totalWeight = 0;
    let noEvolutionChance = 1;

    for (const ev of evolutions) {
      if (ev.level > level) {
        continue;
      }

      let evolutionChance: number;

      const evolutionSpecies = getPokemonSpecies(ev.speciesId);
      const isRegionalEvolution = !this.isRegional() && evolutionSpecies.isRegional();

      if (!forTrainer && isRegionalEvolution) {
        evolutionChance = 0;
      } else {
        if (ev.wildDelay === SpeciesWildEvolutionDelay.NONE) {
          if (strength === PartyMemberStrength.STRONGER) {
            evolutionChance = 1;
          } else {
            const maxLevelDiff = this.getStrengthLevelDiff(strength); //The maximum distance from the evolution level tolerated for the mon to not evolve
            const minChance: number = 0.875 - 0.125 * strength;

            evolutionChance = Math.min(
              minChance + easeInFunc(Math.min(level - ev.level, maxLevelDiff) / maxLevelDiff) * (1 - minChance),
              1,
            );
          }
        } else {
          const preferredMinLevel = Math.max(ev.level - 1 + ev.wildDelay! * this.getStrengthLevelDiff(strength), 1); // TODO: is the bang correct?
          let evolutionLevel = Math.max(ev.level > 1 ? ev.level : Math.floor(preferredMinLevel / 2), 1);

          if (ev.level <= 1 && pokemonPrevolutions.hasOwnProperty(this.speciesId)) {
            const prevolutionLevel = pokemonEvolutions[pokemonPrevolutions[this.speciesId]].find(
              (ev) => ev.speciesId === this.speciesId,
            )!.level; // TODO: is the bang correct?
            if (prevolutionLevel > 1) {
              evolutionLevel = prevolutionLevel;
            }
          }

          evolutionChance = Math.min(
            0.65 * easeInFunc(Math.min(Math.max(level - evolutionLevel, 0), preferredMinLevel) / preferredMinLevel)
              + 0.35
                * easeOutFunc(
                  Math.min(Math.max(level - evolutionLevel, 0), preferredMinLevel * 2.5) / (preferredMinLevel * 2.5),
                ),
            1,
          );
        }
      }

      //TODO: Adjust templates and delays so we don't have to hardcode it
      /* TEMPORARY! (Most) Trainers shouldn't be using unevolved Pokemon by the third gym leader / wave 80. Exceptions to this include Breeders, whose large teams are balanced by the use of weaker pokemon */
      if (currentWave >= 80 && forTrainer && strength > PartyMemberStrength.WEAKER) {
        evolutionChance = 1;
        noEvolutionChance = 0;
      }

      if (evolutionChance > 0) {
        if (isRegionalEvolution) {
          evolutionChance /= evolutionSpecies.isRareRegional() ? 16 : 4;
        }

        totalWeight += evolutionChance;

        evolutionPool.set(totalWeight, ev.speciesId);

        if (1 - evolutionChance < noEvolutionChance) {
          noEvolutionChance = 1 - evolutionChance;
        }
      }
    }

    if (noEvolutionChance === 1 || Phaser.Math.RND.realInRange(0, 1) < noEvolutionChance) {
      return this.speciesId;
    }

    const randValue = evolutionPool.size === 1 ? 0 : randSeedInt(totalWeight);

    for (const weight of evolutionPool.keys()) {
      if (randValue < weight) {
        return getPokemonSpecies(evolutionPool.get(weight)).getSpeciesForLevel(
          level,
          true,
          forTrainer,
          strength,
          currentWave,
        );
      }
    }

    return this.speciesId;
  }

  getEvolutionLevels(): EvolutionLevel[] {
    const evolutionLevels: EvolutionLevel[] = [];

    //console.log(Species[this.speciesId], pokemonEvolutions[this.speciesId])

    if (pokemonEvolutions.hasOwnProperty(this.speciesId)) {
      for (const e of pokemonEvolutions[this.speciesId]) {
        const speciesId = e.speciesId;
        const level = e.level;
        evolutionLevels.push([speciesId, level]);
        //console.log(Species[speciesId], getPokemonSpecies(speciesId), getPokemonSpecies(speciesId).getEvolutionLevels());
        const nextEvolutionLevels = getPokemonSpecies(speciesId).getEvolutionLevels();
        for (const npl of nextEvolutionLevels) {
          evolutionLevels.push(npl);
        }
      }
    }

    return evolutionLevels;
  }

  getPrevolutionLevels(): EvolutionLevel[] {
    const prevolutionLevels: EvolutionLevel[] = [];

    const allEvolvingPokemon = Object.keys(pokemonEvolutions);
    for (const p of allEvolvingPokemon) {
      for (const e of pokemonEvolutions[p]) {
        if (
          e.speciesId === this.speciesId
          && (!this.forms.length || !e.evoFormKey || e.evoFormKey === this.forms[this.formIndex].formKey)
          && prevolutionLevels.every((pe) => pe[0] !== parseInt(p))
        ) {
          const speciesId = parseInt(p) as Species;
          const level = e.level;
          prevolutionLevels.push([speciesId, level]);
          const subPrevolutionLevels = getPokemonSpecies(speciesId).getPrevolutionLevels();
          for (const spl of subPrevolutionLevels) {
            prevolutionLevels.push(spl);
          }
        }
      }
    }

    return prevolutionLevels;
  }

  // This could definitely be written better and more accurate to the getSpeciesForLevel logic, but it is only for generating movesets for evolved Pokemon
  getSimulatedEvolutionChain(
    currentLevel: number,
    forTrainer: boolean = false,
    isBoss: boolean = false,
    player: boolean = false,
  ): EvolutionLevel[] {
    const ret: EvolutionLevel[] = [];
    if (pokemonPrevolutions.hasOwnProperty(this.speciesId)) {
      const prevolutionLevels = this.getPrevolutionLevels().reverse();
      const levelDiff = player ? 0 : forTrainer || isBoss ? (forTrainer && isBoss ? 2.5 : 5) : 10;
      ret.push([prevolutionLevels[0][0], 1]);
      for (let l = 1; l < prevolutionLevels.length; l++) {
        const evolution = pokemonEvolutions[prevolutionLevels[l - 1][0]].find(
          (e) => e.speciesId === prevolutionLevels[l][0],
        );
        ret.push([
          prevolutionLevels[l][0],
          Math.min(
            Math.max(
              evolution?.level!
                + Math.round(randSeedGauss(0.5, 1 + levelDiff * 0.2) * Math.max(evolution?.wildDelay!, 0.5) * 5)
                - 1,
              2,
              evolution?.level!,
            ),
            currentLevel - 1,
          ),
        ]); // TODO: are those bangs correct?
      }
      const lastPrevolutionLevel = ret[prevolutionLevels.length - 1][1];
      const evolution = pokemonEvolutions[prevolutionLevels[prevolutionLevels.length - 1][0]].find(
        (e) => e.speciesId === this.speciesId,
      );
      ret.push([
        this.speciesId,
        Math.min(
          Math.max(
            lastPrevolutionLevel
              + Math.round(randSeedGauss(0.5, 1 + levelDiff * 0.2) * Math.max(evolution?.wildDelay!, 0.5) * 5),
            lastPrevolutionLevel + 1,
            evolution?.level!,
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
    const hasPrevolution = pokemonPrevolutions.hasOwnProperty(this.speciesId);
    const category = this.group;
    return (species) => {
      return (
        (category !== SpeciesGroups.COMMON
          || (pokemonEvolutions.hasOwnProperty(species.speciesId) === hasEvolution
            && pokemonPrevolutions.hasOwnProperty(species.speciesId) === hasPrevolution))
        && species.group === category
        && (this.isTrainerForbidden() || !species.isTrainerForbidden())
        && species.speciesId !== Species.DITTO
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
