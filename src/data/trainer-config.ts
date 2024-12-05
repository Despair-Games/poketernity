import { startingWave } from "#app/battle-scene";
import { globalScene } from "#app/global-scene";
import { ModifierTypeFunc, modifierTypes } from "#app/modifier/modifier-type";
import { EnemyPokemon } from "#app/field/pokemon";
import * as Utils from "#app/utils";
import PokemonSpecies, { getPokemonSpecies, PokemonSpeciesFilter } from "#app/data/pokemon-species";
import { Type } from "#enums/type";
import { doubleBattleDialogue } from "#app/data/dialogue";
import { PersistentModifier } from "#app/modifier/modifier";
import { TrainerVariant } from "#app/field/trainer";
import { getIsInitialized, initI18n } from "#app/plugins/i18n";
import i18next from "i18next";
import { PartyMemberStrength } from "#enums/party-member-strength";
import { Species } from "#enums/species";
import { TrainerType } from "#enums/trainer-type";

/** Minimum BST for Pokemon generated onto the Elite Four's teams */
const ELITE_FOUR_MINIMUM_BST = 460;
/** Minimum BST for Pokemon generated onto the E4 Champion's team */
const CHAMPION_MINIMUM_BST = 508;

export enum TrainerPoolTier {
  COMMON,
  UNCOMMON,
  RARE,
  SUPER_RARE,
  ULTRA_RARE,
}

export interface TrainerTierPools {
  [key: integer]: Species[];
}

export enum TrainerSlot {
  NONE,
  TRAINER,
  TRAINER_PARTNER,
}

/**
 * Class that represents a trainer's party
 * @param size - the number of Pokemon in the party (1-6)
 * @param strength - how strong the Pokemon are
 * @param sameSpecies - whether or not all Pokemon in this party ar ethe same
 * @param balanced - whether or not to add an extra retry check in trainer.ts if there are any duplicate types
 */
export class TrainerPartyTemplate {
  public size: number;
  public strength: PartyMemberStrength;
  public sameSpecies: boolean;
  public balanced: boolean;

  constructor(size: number, strength: PartyMemberStrength, sameSpecies?: boolean, balanced?: boolean) {
    this.size = size;
    this.strength = strength;
    this.sameSpecies = !!sameSpecies;
    this.balanced = !!balanced;
  }

  getStrength(index: number): PartyMemberStrength {
    return this.strength;
  }

  isSameSpecies(index: number): boolean {
    return this.sameSpecies;
  }

  isBalanced(index: number): boolean {
    return this.balanced;
  }
}

/**
 * A TrainerPartyTemplate that holds other TrainerPartyTemplates
 */
export class TrainerPartyCompoundTemplate extends TrainerPartyTemplate {
  public templates: TrainerPartyTemplate[];

  constructor(...templates: TrainerPartyTemplate[]) {
    super(
      templates.reduce((total: number, template: TrainerPartyTemplate) => {
        total += template.size;
        return total;
      }, 0),
      PartyMemberStrength.AVERAGE,
    );
    this.templates = templates;
  }

  getStrength(index: number): PartyMemberStrength {
    let t = 0;
    for (const template of this.templates) {
      if (t + template.size > index) {
        return template.getStrength(index - t);
      }
      t += template.size;
    }

    return super.getStrength(index);
  }

  isSameSpecies(index: number): boolean {
    let t = 0;
    for (const template of this.templates) {
      if (t + template.size > index) {
        return template.isSameSpecies(index - t);
      }
      t += template.size;
    }

    return super.isSameSpecies(index);
  }

  isBalanced(index: number): boolean {
    let t = 0;
    for (const template of this.templates) {
      if (t + template.size > index) {
        return template.isBalanced(index - t);
      }
      t += template.size;
    }

    return super.isBalanced(index);
  }
}

export const trainerPartyTemplates = {
  ONE_WEAK_ONE_STRONG: new TrainerPartyCompoundTemplate(
    new TrainerPartyTemplate(1, PartyMemberStrength.WEAK),
    new TrainerPartyTemplate(1, PartyMemberStrength.STRONG),
  ),
  ONE_AVG: new TrainerPartyTemplate(1, PartyMemberStrength.AVERAGE),
  ONE_AVG_ONE_STRONG: new TrainerPartyCompoundTemplate(
    new TrainerPartyTemplate(1, PartyMemberStrength.AVERAGE),
    new TrainerPartyTemplate(1, PartyMemberStrength.STRONG),
  ),
  ONE_STRONG: new TrainerPartyTemplate(1, PartyMemberStrength.STRONG),
  ONE_STRONGER: new TrainerPartyTemplate(1, PartyMemberStrength.STRONGER),
  TWO_WEAKER: new TrainerPartyTemplate(2, PartyMemberStrength.WEAKER),
  TWO_WEAK: new TrainerPartyTemplate(2, PartyMemberStrength.WEAK),
  TWO_WEAK_ONE_AVG: new TrainerPartyCompoundTemplate(
    new TrainerPartyTemplate(2, PartyMemberStrength.WEAK),
    new TrainerPartyTemplate(1, PartyMemberStrength.AVERAGE),
  ),
  TWO_WEAK_SAME_ONE_AVG: new TrainerPartyCompoundTemplate(
    new TrainerPartyTemplate(2, PartyMemberStrength.WEAK, true),
    new TrainerPartyTemplate(1, PartyMemberStrength.AVERAGE),
  ),
  TWO_WEAK_SAME_TWO_WEAK_SAME: new TrainerPartyCompoundTemplate(
    new TrainerPartyTemplate(2, PartyMemberStrength.WEAK, true),
    new TrainerPartyTemplate(2, PartyMemberStrength.WEAK, true),
  ),
  TWO_WEAK_ONE_STRONG: new TrainerPartyCompoundTemplate(
    new TrainerPartyTemplate(2, PartyMemberStrength.WEAK),
    new TrainerPartyTemplate(1, PartyMemberStrength.STRONG),
  ),
  TWO_AVG: new TrainerPartyTemplate(2, PartyMemberStrength.AVERAGE),
  TWO_AVG_ONE_STRONG: new TrainerPartyCompoundTemplate(
    new TrainerPartyTemplate(2, PartyMemberStrength.AVERAGE),
    new TrainerPartyTemplate(1, PartyMemberStrength.STRONG),
  ),
  TWO_AVG_SAME_ONE_AVG: new TrainerPartyCompoundTemplate(
    new TrainerPartyTemplate(2, PartyMemberStrength.AVERAGE, true),
    new TrainerPartyTemplate(1, PartyMemberStrength.AVERAGE),
  ),
  TWO_AVG_SAME_ONE_STRONG: new TrainerPartyCompoundTemplate(
    new TrainerPartyTemplate(2, PartyMemberStrength.AVERAGE, true),
    new TrainerPartyTemplate(1, PartyMemberStrength.STRONG),
  ),
  TWO_AVG_SAME_TWO_AVG_SAME: new TrainerPartyCompoundTemplate(
    new TrainerPartyTemplate(2, PartyMemberStrength.AVERAGE, true),
    new TrainerPartyTemplate(2, PartyMemberStrength.AVERAGE, true),
  ),
  TWO_STRONG: new TrainerPartyTemplate(2, PartyMemberStrength.STRONG),
  THREE_WEAK: new TrainerPartyTemplate(3, PartyMemberStrength.WEAK),
  THREE_WEAK_SAME: new TrainerPartyTemplate(3, PartyMemberStrength.WEAK, true),
  THREE_AVG: new TrainerPartyTemplate(3, PartyMemberStrength.AVERAGE),
  THREE_AVG_SAME: new TrainerPartyTemplate(3, PartyMemberStrength.AVERAGE, true),
  THREE_WEAK_BALANCED: new TrainerPartyTemplate(3, PartyMemberStrength.WEAK, false, true),
  FOUR_WEAKER: new TrainerPartyTemplate(4, PartyMemberStrength.WEAKER),
  FOUR_WEAKER_SAME: new TrainerPartyTemplate(4, PartyMemberStrength.WEAKER, true),
  FOUR_WEAK: new TrainerPartyTemplate(4, PartyMemberStrength.WEAK),
  FOUR_WEAK_SAME: new TrainerPartyTemplate(4, PartyMemberStrength.WEAK, true),
  FOUR_WEAK_BALANCED: new TrainerPartyTemplate(4, PartyMemberStrength.WEAK, false, true),
  FIVE_WEAKER: new TrainerPartyTemplate(5, PartyMemberStrength.WEAKER),
  FIVE_WEAK: new TrainerPartyTemplate(5, PartyMemberStrength.WEAK),
  FIVE_WEAK_BALANCED: new TrainerPartyTemplate(5, PartyMemberStrength.WEAK, false, true),
  SIX_WEAKER: new TrainerPartyTemplate(6, PartyMemberStrength.WEAKER),
  SIX_WEAKER_SAME: new TrainerPartyTemplate(6, PartyMemberStrength.WEAKER, true),
  SIX_WEAK_SAME: new TrainerPartyTemplate(6, PartyMemberStrength.WEAK, true),
  SIX_WEAK_BALANCED: new TrainerPartyTemplate(6, PartyMemberStrength.WEAK, false, true),

  GYM_LEADER_1: new TrainerPartyCompoundTemplate(
    new TrainerPartyTemplate(1, PartyMemberStrength.AVERAGE),
    new TrainerPartyTemplate(1, PartyMemberStrength.STRONG),
  ),
  GYM_LEADER_2: new TrainerPartyCompoundTemplate(
    new TrainerPartyTemplate(1, PartyMemberStrength.AVERAGE),
    new TrainerPartyTemplate(1, PartyMemberStrength.STRONG),
    new TrainerPartyTemplate(1, PartyMemberStrength.STRONGER),
  ),
  GYM_LEADER_3: new TrainerPartyCompoundTemplate(
    new TrainerPartyTemplate(2, PartyMemberStrength.AVERAGE),
    new TrainerPartyTemplate(1, PartyMemberStrength.STRONG),
    new TrainerPartyTemplate(1, PartyMemberStrength.STRONGER),
  ),
  GYM_LEADER_4: new TrainerPartyCompoundTemplate(
    new TrainerPartyTemplate(3, PartyMemberStrength.AVERAGE),
    new TrainerPartyTemplate(1, PartyMemberStrength.STRONG),
    new TrainerPartyTemplate(1, PartyMemberStrength.STRONGER),
  ),
  GYM_LEADER_5: new TrainerPartyCompoundTemplate(
    new TrainerPartyTemplate(3, PartyMemberStrength.AVERAGE),
    new TrainerPartyTemplate(2, PartyMemberStrength.STRONG),
    new TrainerPartyTemplate(1, PartyMemberStrength.STRONGER),
  ),

  ELITE_FOUR: new TrainerPartyCompoundTemplate(
    new TrainerPartyTemplate(2, PartyMemberStrength.AVERAGE),
    new TrainerPartyTemplate(3, PartyMemberStrength.STRONG),
    new TrainerPartyTemplate(1, PartyMemberStrength.STRONGER),
  ),

  CHAMPION: new TrainerPartyCompoundTemplate(
    new TrainerPartyTemplate(1, PartyMemberStrength.STRONGER),
    new TrainerPartyTemplate(5, PartyMemberStrength.STRONG, false, true),
  ),

  RIVAL: new TrainerPartyCompoundTemplate(
    new TrainerPartyTemplate(1, PartyMemberStrength.STRONG),
    new TrainerPartyTemplate(1, PartyMemberStrength.AVERAGE),
  ),
  RIVAL_2: new TrainerPartyCompoundTemplate(
    new TrainerPartyTemplate(1, PartyMemberStrength.STRONG),
    new TrainerPartyTemplate(1, PartyMemberStrength.AVERAGE),
    new TrainerPartyTemplate(1, PartyMemberStrength.WEAK, false, true),
  ),
  RIVAL_3: new TrainerPartyCompoundTemplate(
    new TrainerPartyTemplate(1, PartyMemberStrength.STRONG),
    new TrainerPartyTemplate(1, PartyMemberStrength.AVERAGE),
    new TrainerPartyTemplate(1, PartyMemberStrength.AVERAGE, false, true),
    new TrainerPartyTemplate(1, PartyMemberStrength.WEAK, false, true),
  ),
  RIVAL_4: new TrainerPartyCompoundTemplate(
    new TrainerPartyTemplate(1, PartyMemberStrength.STRONG),
    new TrainerPartyTemplate(1, PartyMemberStrength.AVERAGE),
    new TrainerPartyTemplate(2, PartyMemberStrength.AVERAGE, false, true),
    new TrainerPartyTemplate(1, PartyMemberStrength.WEAK, false, true),
  ),
  RIVAL_5: new TrainerPartyCompoundTemplate(
    new TrainerPartyTemplate(1, PartyMemberStrength.STRONG),
    new TrainerPartyTemplate(1, PartyMemberStrength.AVERAGE),
    new TrainerPartyTemplate(3, PartyMemberStrength.AVERAGE, false, true),
    new TrainerPartyTemplate(1, PartyMemberStrength.STRONG),
  ),
  RIVAL_6: new TrainerPartyCompoundTemplate(
    new TrainerPartyTemplate(1, PartyMemberStrength.STRONG),
    new TrainerPartyTemplate(1, PartyMemberStrength.AVERAGE),
    new TrainerPartyTemplate(3, PartyMemberStrength.AVERAGE, false, true),
    new TrainerPartyTemplate(1, PartyMemberStrength.STRONGER),
  ),
};

type PartyTemplateFunc = () => TrainerPartyTemplate;
type PartyMemberFunc = (level: integer, strength: PartyMemberStrength) => EnemyPokemon;
type GenModifiersFunc = (party: EnemyPokemon[]) => PersistentModifier[];

export interface PartyMemberFuncs {
  [key: number]: PartyMemberFunc;
}

export class TrainerConfig {
  public trainerType: TrainerType;
  public trainerTypeDouble: TrainerType;
  public name: string;
  public nameFemale: string;
  public nameDouble: string;
  public title: string;
  public titleDouble: string;
  public hasGenders: boolean = false;
  public hasDouble: boolean = false;
  public hasCharSprite: boolean = false;
  public doubleOnly: boolean = false;
  public moneyMultiplier: number = 1;
  public isBoss: boolean = false;
  public hasStaticParty: boolean = false;
  public useSameSeedForAllMembers: boolean = false;
  public mixedBattleBgm: string;
  public battleBgm: string;
  public encounterBgm: string;
  public femaleEncounterBgm: string;
  public doubleEncounterBgm: string;
  public victoryBgm: string;
  public genModifiersFunc: GenModifiersFunc;
  public modifierRewardFuncs: ModifierTypeFunc[] = [];
  public partyTemplates: TrainerPartyTemplate[];
  public partyTemplateFunc: PartyTemplateFunc;
  public eventRewardFuncs: ModifierTypeFunc[] = [];
  public partyMemberFuncs: PartyMemberFuncs = {};
  public speciesPools: TrainerTierPools;
  public speciesFilter: PokemonSpeciesFilter;
  public specialtyTypes: Type[] = [];
  public hasVoucher: boolean = false;

  public encounterMessages: string[] = [];
  public victoryMessages: string[] = [];
  public defeatMessages: string[] = [];

  public femaleEncounterMessages: string[];
  public femaleVictoryMessages: string[];
  public femaleDefeatMessages: string[];

  public doubleEncounterMessages: string[];
  public doubleVictoryMessages: string[];
  public doubleDefeatMessages: string[];

  constructor(trainerType: TrainerType, allowLegendaries?: boolean) {
    this.trainerType = trainerType;
    this.name = Utils.toReadableString(TrainerType[this.getDerivedType()]);
    this.battleBgm = "battle_trainer";
    this.mixedBattleBgm = "battle_trainer";
    this.victoryBgm = "victory_trainer";
    this.partyTemplates = [trainerPartyTemplates.TWO_AVG];
    this.speciesFilter = (species) =>
      (allowLegendaries || (!species.legendary && !species.subLegendary && !species.mythical)) &&
      !species.isTrainerForbidden();
  }

  getKey(): string {
    return TrainerType[this.getDerivedType()].toString().toLowerCase();
  }

  getSpriteKey(female?: boolean, isDouble: boolean = false): string {
    let ret = this.getKey();
    if (this.hasGenders) {
      ret += `_${female ? "f" : "m"}`;
    }
    // If a special double trainer class was set, set it as the sprite key
    if (this.trainerTypeDouble && female && isDouble) {
      // Get the derived type for the double trainer since the sprite key is based on the derived type
      ret = TrainerType[this.getDerivedType(this.trainerTypeDouble)].toString().toLowerCase();
    }
    return ret;
  }

  setName(name: string): TrainerConfig {
    if (name === "Finn") {
      // Give the rival a localized name
      // First check if i18n is initialized
      if (!getIsInitialized()) {
        initI18n();
      }
      // This is only the male name, because the female name is handled in a different function (setHasGenders)
      if (name === "Finn") {
        name = i18next.t("trainerNames:rival");
      }
    }

    this.name = name;

    return this;
  }

  /**
   * Sets if a boss trainer will have a voucher or not.
   * @param hasVoucher - If the boss trainer will have a voucher.
   */
  setHasVoucher(hasVoucher: boolean): void {
    this.hasVoucher = hasVoucher;
  }

  setTitle(title: string): TrainerConfig {
    // First check if i18n is initialized
    if (!getIsInitialized()) {
      initI18n();
    }

    // Make the title lowercase and replace spaces with underscores
    title = title.toLowerCase().replace(/\s/g, "_");

    // Get the title from the i18n file
    this.title = i18next.t(`titles:${title}`);

    return this;
  }

  /**
   * Returns the derived trainer type for a given trainer type.
   * @param trainerTypeToDeriveFrom - The trainer type to derive from. (If null, the this.trainerType property will be used.)
   * @returns {TrainerType} - The derived trainer type.
   */
  getDerivedType(trainerTypeToDeriveFrom: TrainerType | null = null): TrainerType {
    let trainerType = trainerTypeToDeriveFrom ? trainerTypeToDeriveFrom : this.trainerType;
    switch (trainerType) {
      case TrainerType.RIVAL_2:
      case TrainerType.RIVAL_3:
      case TrainerType.RIVAL_4:
      case TrainerType.RIVAL_5:
      case TrainerType.RIVAL_6:
        trainerType = TrainerType.RIVAL;
        break;
      case TrainerType.LANCE_CHAMPION:
        trainerType = TrainerType.LANCE;
        break;
      case TrainerType.LARRY_ELITE:
        trainerType = TrainerType.LARRY;
        break;
      case TrainerType.ROCKET_BOSS_GIOVANNI_1:
      case TrainerType.ROCKET_BOSS_GIOVANNI_2:
        trainerType = TrainerType.GIOVANNI;
        break;
      case TrainerType.MAXIE_2:
        trainerType = TrainerType.MAXIE;
        break;
      case TrainerType.ARCHIE_2:
        trainerType = TrainerType.ARCHIE;
        break;
      case TrainerType.CYRUS_2:
        trainerType = TrainerType.CYRUS;
        break;
      case TrainerType.GHETSIS_2:
        trainerType = TrainerType.GHETSIS;
        break;
      case TrainerType.LYSANDRE_2:
        trainerType = TrainerType.LYSANDRE;
        break;
      case TrainerType.LUSAMINE_2:
        trainerType = TrainerType.LUSAMINE;
        break;
      case TrainerType.GUZMA_2:
        trainerType = TrainerType.GUZMA;
        break;
      case TrainerType.ROSE_2:
        trainerType = TrainerType.ROSE;
        break;
      case TrainerType.PENNY_2:
        trainerType = TrainerType.PENNY;
        break;
      case TrainerType.MARNIE_ELITE:
        trainerType = TrainerType.MARNIE;
        break;
      case TrainerType.NESSA_ELITE:
        trainerType = TrainerType.NESSA;
        break;
      case TrainerType.BEA_ELITE:
        trainerType = TrainerType.BEA;
        break;
      case TrainerType.ALLISTER_ELITE:
        trainerType = TrainerType.ALLISTER;
        break;
      case TrainerType.RAIHAN_ELITE:
        trainerType = TrainerType.RAIHAN;
        break;
    }

    return trainerType;
  }

  /**
   * Sets the configuration for trainers with genders, including the female name and encounter background music (BGM).
   * @param {string} [nameFemale] The name of the female trainer. If 'Ivy', a localized name will be assigned.
   * @param {TrainerType | string} [femaleEncounterBgm] The encounter BGM for the female trainer, which can be a TrainerType or a string.
   * @returns {TrainerConfig} The updated TrainerConfig instance.
   **/
  setHasGenders(nameFemale?: string, femaleEncounterBgm?: TrainerType | string): TrainerConfig {
    // If the female name is 'Ivy' (the rival), assign a localized name.
    if (nameFemale === "Ivy") {
      // Check if the internationalization (i18n) system is initialized.
      if (!getIsInitialized()) {
        // Initialize the i18n system if it is not already initialized.
        initI18n();
      }
      // Set the localized name for the female rival.
      this.nameFemale = i18next.t("trainerNames:rival_female");
    } else {
      // Otherwise, assign the provided female name.
      this.nameFemale = nameFemale!; // TODO: is this bang correct?
    }

    // Indicate that this trainer configuration includes genders.
    this.hasGenders = true;

    // If a female encounter BGM is provided.
    if (femaleEncounterBgm) {
      // If the BGM is a TrainerType (number), convert it to a string, replace underscores with spaces, and convert to lowercase.
      // Otherwise, assign the provided string as the BGM.
      this.femaleEncounterBgm =
        typeof femaleEncounterBgm === "number"
          ? TrainerType[femaleEncounterBgm].toString().replace(/_/g, " ").toLowerCase()
          : femaleEncounterBgm;
    }

    // Return the updated TrainerConfig instance.
    return this;
  }

  /**
   * Sets the configuration for trainers with double battles, including the name of the double trainer and the encounter BGM.
   * @param nameDouble The name of the double trainer (e.g., "Ace Duo" for Trainer Class Doubles or "red_blue_double" for NAMED trainer doubles).
   * @param doubleEncounterBgm The encounter BGM for the double trainer, which can be a TrainerType or a string.
   * @returns {TrainerConfig} The updated TrainerConfig instance.
   */
  setHasDouble(nameDouble: string, doubleEncounterBgm?: TrainerType | string): TrainerConfig {
    this.hasDouble = true;
    this.nameDouble = nameDouble;
    if (doubleEncounterBgm) {
      this.doubleEncounterBgm =
        typeof doubleEncounterBgm === "number"
          ? TrainerType[doubleEncounterBgm].toString().replace(/\_/g, " ").toLowerCase()
          : doubleEncounterBgm;
    }
    return this;
  }

  /**
   * Sets the trainer type for double battles.
   * @param trainerTypeDouble The TrainerType of the partner in a double battle.
   * @returns {TrainerConfig} The updated TrainerConfig instance.
   */
  setDoubleTrainerType(trainerTypeDouble: TrainerType): TrainerConfig {
    this.trainerTypeDouble = trainerTypeDouble;
    this.setDoubleMessages(this.nameDouble);
    return this;
  }

  /**
   * Sets the encounter and victory messages for double trainers.
   * @param nameDouble - The name of the pair (e.g. "red_blue_double").
   */
  setDoubleMessages(nameDouble: string) {
    // Check if there is double battle dialogue for this trainer
    if (doubleBattleDialogue[nameDouble]) {
      // Set encounter and victory messages for double trainers
      this.doubleEncounterMessages = doubleBattleDialogue[nameDouble].encounter;
      this.doubleVictoryMessages = doubleBattleDialogue[nameDouble].victory;
      this.doubleDefeatMessages = doubleBattleDialogue[nameDouble].defeat;
    }
  }

  /**
   * Sets the title for double trainers
   * @param titleDouble The key for the title in the i18n file. (e.g., "champion_double").
   * @returns {TrainerConfig} The updated TrainerConfig instance.
   */
  setDoubleTitle(titleDouble: string): TrainerConfig {
    // First check if i18n is initialized
    if (!getIsInitialized()) {
      initI18n();
    }

    // Make the title lowercase and replace spaces with underscores
    titleDouble = titleDouble.toLowerCase().replace(/\s/g, "_");

    // Get the title from the i18n file
    this.titleDouble = i18next.t(`titles:${titleDouble}`);

    return this;
  }

  setHasCharSprite(): TrainerConfig {
    this.hasCharSprite = true;
    return this;
  }

  setDoubleOnly(): TrainerConfig {
    this.doubleOnly = true;
    return this;
  }

  setMoneyMultiplier(moneyMultiplier: number): TrainerConfig {
    this.moneyMultiplier = moneyMultiplier;
    return this;
  }

  setBoss(): TrainerConfig {
    this.isBoss = true;
    return this;
  }

  setStaticParty(): TrainerConfig {
    this.hasStaticParty = true;
    return this;
  }

  setUseSameSeedForAllMembers(): TrainerConfig {
    this.useSameSeedForAllMembers = true;
    return this;
  }

  setMixedBattleBgm(mixedBattleBgm: string): TrainerConfig {
    this.mixedBattleBgm = mixedBattleBgm;
    return this;
  }

  setBattleBgm(battleBgm: string): TrainerConfig {
    this.battleBgm = battleBgm;
    return this;
  }

  setEncounterBgm(encounterBgm: TrainerType | string): TrainerConfig {
    this.encounterBgm =
      typeof encounterBgm === "number" ? TrainerType[encounterBgm].toString().toLowerCase() : encounterBgm;
    return this;
  }

  setVictoryBgm(victoryBgm: string): TrainerConfig {
    this.victoryBgm = victoryBgm;
    return this;
  }

  setPartyTemplates(...partyTemplates: TrainerPartyTemplate[]): TrainerConfig {
    this.partyTemplates = partyTemplates;
    return this;
  }

  setPartyTemplateFunc(partyTemplateFunc: PartyTemplateFunc): TrainerConfig {
    this.partyTemplateFunc = partyTemplateFunc;
    return this;
  }

  setPartyMemberFunc(slotIndex: integer, partyMemberFunc: PartyMemberFunc): TrainerConfig {
    this.partyMemberFuncs[slotIndex] = partyMemberFunc;
    return this;
  }

  setSpeciesPools(speciesPools: TrainerTierPools | Species[]): TrainerConfig {
    this.speciesPools = (Array.isArray(speciesPools)
      ? { [TrainerPoolTier.COMMON]: speciesPools }
      : speciesPools) as unknown as TrainerTierPools;
    return this;
  }

  setSpeciesFilter(speciesFilter: PokemonSpeciesFilter, allowLegendaries?: boolean): TrainerConfig {
    const baseFilter = this.speciesFilter;
    this.speciesFilter = allowLegendaries ? speciesFilter : (species) => speciesFilter(species) && baseFilter(species);
    return this;
  }

  setSpecialtyTypes(...specialtyTypes: Type[]): TrainerConfig {
    this.specialtyTypes = specialtyTypes;
    return this;
  }

  setGenModifiersFunc(genModifiersFunc: GenModifiersFunc): TrainerConfig {
    this.genModifiersFunc = genModifiersFunc;
    return this;
  }

  setEventModifierRewardFuncs(...modifierTypeFuncs: (() => ModifierTypeFunc)[]): TrainerConfig {
    this.eventRewardFuncs = modifierTypeFuncs.map((func) => () => {
      const modifierTypeFunc = func();
      const modifierType = modifierTypeFunc();
      modifierType.withIdFromFunc(modifierTypeFunc);
      return modifierType;
    });
    return this;
  }

  setModifierRewardFuncs(...modifierTypeFuncs: (() => ModifierTypeFunc)[]): TrainerConfig {
    this.modifierRewardFuncs = modifierTypeFuncs.map((func) => () => {
      const modifierTypeFunc = func();
      const modifierType = modifierTypeFunc();
      modifierType.withIdFromFunc(modifierTypeFunc);
      return modifierType;
    });
    return this;
  }

  /**
   * Returns the pool of species for an evil team admin
   * @param team - The evil team the admin belongs to.
   * @returns {TrainerTierPools}
   */
  speciesPoolPerEvilTeamAdmin(team): TrainerTierPools {
    team = team.toLowerCase();
    switch (team) {
      case "rocket": {
        return {
          [TrainerPoolTier.COMMON]: [
            Species.RATTATA,
            Species.KOFFING,
            Species.EKANS,
            Species.ZUBAT,
            Species.MAGIKARP,
            Species.HOUNDOUR,
            Species.ONIX,
            Species.CUBONE,
            Species.GROWLITHE,
            Species.MURKROW,
            Species.GASTLY,
            Species.EXEGGCUTE,
            Species.VOLTORB,
            Species.DROWZEE,
            Species.VILEPLUME,
          ],
          [TrainerPoolTier.UNCOMMON]: [
            Species.PORYGON,
            Species.MANKEY,
            Species.MAGNEMITE,
            Species.ALOLA_SANDSHREW,
            Species.ALOLA_MEOWTH,
            Species.ALOLA_GRIMER,
            Species.ALOLA_GEODUDE,
            Species.PALDEA_TAUROS,
            Species.OMANYTE,
            Species.KABUTO,
            Species.MAGBY,
            Species.ELEKID,
          ],
          [TrainerPoolTier.RARE]: [Species.DRATINI, Species.LARVITAR],
        };
      }
      case "magma": {
        return {
          [TrainerPoolTier.COMMON]: [
            Species.GROWLITHE,
            Species.SLUGMA,
            Species.SOLROCK,
            Species.HIPPOPOTAS,
            Species.BALTOY,
            Species.ROLYCOLY,
            Species.GLIGAR,
            Species.TORKOAL,
            Species.HOUNDOUR,
            Species.MAGBY,
          ],
          [TrainerPoolTier.UNCOMMON]: [
            Species.TRAPINCH,
            Species.SILICOBRA,
            Species.RHYHORN,
            Species.ANORITH,
            Species.LILEEP,
            Species.HISUI_GROWLITHE,
            Species.TURTONATOR,
            Species.ARON,
            Species.TOEDSCOOL,
          ],
          [TrainerPoolTier.RARE]: [Species.CAPSAKID, Species.CHARCADET],
        };
      }
      case "aqua": {
        return {
          [TrainerPoolTier.COMMON]: [
            Species.CORPHISH,
            Species.SPHEAL,
            Species.CLAMPERL,
            Species.CHINCHOU,
            Species.WOOPER,
            Species.WINGULL,
            Species.TENTACOOL,
            Species.AZURILL,
            Species.LOTAD,
            Species.WAILMER,
            Species.REMORAID,
            Species.BARBOACH,
          ],
          [TrainerPoolTier.UNCOMMON]: [
            Species.MANTYKE,
            Species.HISUI_QWILFISH,
            Species.ARROKUDA,
            Species.DHELMISE,
            Species.CLOBBOPUS,
            Species.FEEBAS,
            Species.PALDEA_WOOPER,
            Species.HORSEA,
            Species.SKRELP,
          ],
          [TrainerPoolTier.RARE]: [Species.DONDOZO, Species.BASCULEGION],
        };
      }
      case "galactic": {
        return {
          [TrainerPoolTier.COMMON]: [
            Species.BRONZOR,
            Species.SWINUB,
            Species.YANMA,
            Species.LICKITUNG,
            Species.TANGELA,
            Species.MAGBY,
            Species.ELEKID,
            Species.SKORUPI,
            Species.ZUBAT,
            Species.MURKROW,
            Species.MAGIKARP,
            Species.VOLTORB,
          ],
          [TrainerPoolTier.UNCOMMON]: [
            Species.HISUI_GROWLITHE,
            Species.HISUI_QWILFISH,
            Species.SNEASEL,
            Species.DUSKULL,
            Species.ROTOM,
            Species.HISUI_VOLTORB,
            Species.GLIGAR,
            Species.ABRA,
          ],
          [TrainerPoolTier.RARE]: [Species.URSALUNA, Species.HISUI_LILLIGANT, Species.SPIRITOMB, Species.HISUI_SNEASEL],
        };
      }
      case "plasma": {
        return {
          [TrainerPoolTier.COMMON]: [
            Species.YAMASK,
            Species.ROGGENROLA,
            Species.JOLTIK,
            Species.TYMPOLE,
            Species.FRILLISH,
            Species.FERROSEED,
            Species.SANDILE,
            Species.TIMBURR,
            Species.DARUMAKA,
            Species.FOONGUS,
            Species.CUBCHOO,
            Species.VANILLITE,
          ],
          [TrainerPoolTier.UNCOMMON]: [
            Species.PAWNIARD,
            Species.VULLABY,
            Species.ZORUA,
            Species.DRILBUR,
            Species.KLINK,
            Species.TYNAMO,
            Species.GALAR_DARUMAKA,
            Species.GOLETT,
            Species.MIENFOO,
            Species.DURANT,
            Species.SIGILYPH,
          ],
          [TrainerPoolTier.RARE]: [Species.HISUI_ZORUA, Species.AXEW, Species.DEINO, Species.HISUI_BRAVIARY],
        };
      }
      case "flare": {
        return {
          [TrainerPoolTier.COMMON]: [
            Species.FLETCHLING,
            Species.LITLEO,
            Species.INKAY,
            Species.FOONGUS,
            Species.HELIOPTILE,
            Species.ELECTRIKE,
            Species.SKORUPI,
            Species.PURRLOIN,
            Species.CLAWITZER,
            Species.PANCHAM,
            Species.ESPURR,
            Species.BUNNELBY,
          ],
          [TrainerPoolTier.UNCOMMON]: [
            Species.LITWICK,
            Species.SNEASEL,
            Species.PUMPKABOO,
            Species.PHANTUMP,
            Species.HONEDGE,
            Species.BINACLE,
            Species.HOUNDOUR,
            Species.SKRELP,
            Species.SLIGGOO,
          ],
          [TrainerPoolTier.RARE]: [Species.NOIBAT, Species.HISUI_AVALUGG, Species.HISUI_SLIGGOO],
        };
      }
      case "aether": {
        return {
          [TrainerPoolTier.COMMON]: [
            Species.BRUXISH,
            Species.SLOWPOKE,
            Species.BALTOY,
            Species.EXEGGCUTE,
            Species.ABRA,
            Species.ALOLA_RAICHU,
            Species.ELGYEM,
            Species.NATU,
            Species.BLIPBUG,
            Species.GIRAFARIG,
            Species.ORANGURU,
          ],
          [TrainerPoolTier.UNCOMMON]: [
            Species.GALAR_SLOWPOKE,
            Species.MEDITITE,
            Species.BELDUM,
            Species.HATENNA,
            Species.INKAY,
            Species.RALTS,
            Species.GALAR_MR_MIME,
          ],
          [TrainerPoolTier.RARE]: [Species.ARMAROUGE, Species.HISUI_BRAVIARY, Species.PORYGON],
        };
      }
      case "skull": {
        return {
          [TrainerPoolTier.COMMON]: [
            Species.MAREANIE,
            Species.ALOLA_GRIMER,
            Species.GASTLY,
            Species.ZUBAT,
            Species.FOMANTIS,
            Species.VENIPEDE,
            Species.BUDEW,
            Species.KOFFING,
            Species.STUNKY,
            Species.CROAGUNK,
            Species.NIDORAN_F,
          ],
          [TrainerPoolTier.UNCOMMON]: [
            Species.GALAR_SLOWPOKE,
            Species.SKORUPI,
            Species.PALDEA_WOOPER,
            Species.VULLABY,
            Species.HISUI_QWILFISH,
            Species.GLIMMET,
          ],
          [TrainerPoolTier.RARE]: [Species.SKRELP, Species.HISUI_SNEASEL],
        };
      }
      case "macro": {
        return {
          [TrainerPoolTier.COMMON]: [
            Species.HATENNA,
            Species.FEEBAS,
            Species.BOUNSWEET,
            Species.SALANDIT,
            Species.GALAR_PONYTA,
            Species.GOTHITA,
            Species.FROSLASS,
            Species.VULPIX,
            Species.FRILLISH,
            Species.ODDISH,
            Species.SINISTEA,
          ],
          [TrainerPoolTier.UNCOMMON]: [
            Species.VULLABY,
            Species.MAREANIE,
            Species.ALOLA_VULPIX,
            Species.TOGEPI,
            Species.GALAR_CORSOLA,
            Species.APPLIN,
          ],
          [TrainerPoolTier.RARE]: [Species.TINKATINK, Species.HISUI_LILLIGANT],
        };
      }
      case "star_1": {
        return {
          [TrainerPoolTier.COMMON]: [
            Species.MURKROW,
            Species.SEEDOT,
            Species.CACNEA,
            Species.STUNKY,
            Species.SANDILE,
            Species.NYMBLE,
            Species.MASCHIFF,
            Species.GALAR_ZIGZAGOON,
          ],
          [TrainerPoolTier.UNCOMMON]: [
            Species.UMBREON,
            Species.SNEASEL,
            Species.CORPHISH,
            Species.ZORUA,
            Species.INKAY,
            Species.BOMBIRDIER,
          ],
          [TrainerPoolTier.RARE]: [Species.DEINO, Species.SPRIGATITO],
        };
      }
      case "star_2": {
        return {
          [TrainerPoolTier.COMMON]: [
            Species.GROWLITHE,
            Species.HOUNDOUR,
            Species.NUMEL,
            Species.LITWICK,
            Species.FLETCHLING,
            Species.LITLEO,
            Species.ROLYCOLY,
            Species.CAPSAKID,
          ],
          [TrainerPoolTier.UNCOMMON]: [
            Species.PONYTA,
            Species.FLAREON,
            Species.MAGBY,
            Species.TORKOAL,
            Species.SALANDIT,
            Species.TURTONATOR,
          ],
          [TrainerPoolTier.RARE]: [Species.LARVESTA, Species.FUECOCO],
        };
      }
      case "star_3": {
        return {
          [TrainerPoolTier.COMMON]: [
            Species.ZUBAT,
            Species.GRIMER,
            Species.STUNKY,
            Species.FOONGUS,
            Species.MAREANIE,
            Species.TOXEL,
            Species.SHROODLE,
            Species.PALDEA_WOOPER,
          ],
          [TrainerPoolTier.UNCOMMON]: [
            Species.GASTLY,
            Species.SEVIPER,
            Species.SKRELP,
            Species.ALOLA_GRIMER,
            Species.GALAR_SLOWPOKE,
            Species.HISUI_QWILFISH,
          ],
          [TrainerPoolTier.RARE]: [Species.GLIMMET, Species.BULBASAUR],
        };
      }
      case "star_4": {
        return {
          [TrainerPoolTier.COMMON]: [
            Species.CLEFFA,
            Species.IGGLYBUFF,
            Species.AZURILL,
            Species.COTTONEE,
            Species.FLABEBE,
            Species.HATENNA,
            Species.IMPIDIMP,
            Species.TINKATINK,
          ],
          [TrainerPoolTier.UNCOMMON]: [
            Species.TOGEPI,
            Species.GARDEVOIR,
            Species.SYLVEON,
            Species.KLEFKI,
            Species.MIMIKYU,
            Species.ALOLA_VULPIX,
          ],
          [TrainerPoolTier.RARE]: [Species.GALAR_PONYTA, Species.POPPLIO],
        };
      }
      case "star_5": {
        return {
          [TrainerPoolTier.COMMON]: [
            Species.SHROOMISH,
            Species.MAKUHITA,
            Species.MEDITITE,
            Species.CROAGUNK,
            Species.SCRAGGY,
            Species.MIENFOO,
            Species.PAWMI,
            Species.PALDEA_TAUROS,
          ],
          [TrainerPoolTier.UNCOMMON]: [
            Species.RIOLU,
            Species.TIMBURR,
            Species.HAWLUCHA,
            Species.PASSIMIAN,
            Species.FALINKS,
            Species.FLAMIGO,
          ],
          [TrainerPoolTier.RARE]: [Species.JANGMO_O, Species.QUAXLY],
        };
      }
    }

    console.warn(`Evil team admin for ${team} not found. Returning empty species pools.`);
    return [];
  }

  /**
   * Initializes the trainer configuration for an evil team admin.
   * @param title The title of the evil team admin.
   * @param poolName The evil team the admin belongs to.
   * @param {Species | Species[]} signatureSpecies The signature species for the evil team leader.
   * @returns {TrainerConfig} The updated TrainerConfig instance.
   * **/
  initForEvilTeamAdmin(title: string, poolName: string, signatureSpecies: (Species | Species[])[]): TrainerConfig {
    if (!getIsInitialized()) {
      initI18n();
    }
    this.setPartyTemplates(trainerPartyTemplates.RIVAL_5);

    // Set the species pools for the evil team admin.
    this.speciesPools = this.speciesPoolPerEvilTeamAdmin(poolName);

    signatureSpecies.forEach((speciesPool, s) => {
      if (!Array.isArray(speciesPool)) {
        speciesPool = [speciesPool];
      }
      this.setPartyMemberFunc(-(s + 1), getRandomPartyMemberFunc(speciesPool));
    });

    const nameForCall = this.name.toLowerCase().replace(/\s/g, "_");
    this.name = i18next.t(`trainerNames:${nameForCall}`);
    this.setHasVoucher(false);
    this.setTitle(title);
    this.setMoneyMultiplier(1.5);
    this.setBoss();
    this.setStaticParty();
    this.setBattleBgm("battle_plasma_boss");
    this.setVictoryBgm("victory_team_plasma");

    return this;
  }

  /**
   * Initializes the trainer configuration for a Stat Trainer, as part of the Trainer's Test Mystery Encounter.
   * @param {Species | Species[]} signatureSpecies The signature species for the Elite Four member.
   * @param {Type[]} specialtyTypes The specialty types for the Stat Trainer.
   * @param isMale Whether the Elite Four Member is Male or Female (for localization of the title).
   * @returns {TrainerConfig} The updated TrainerConfig instance.
   **/
  initForStatTrainer(
    signatureSpecies: (Species | Species[])[],
    isMale: boolean,
    ...specialtyTypes: Type[]
  ): TrainerConfig {
    if (!getIsInitialized()) {
      initI18n();
    }

    this.setPartyTemplates(trainerPartyTemplates.ELITE_FOUR);

    signatureSpecies.forEach((speciesPool, s) => {
      if (!Array.isArray(speciesPool)) {
        speciesPool = [speciesPool];
      }
      this.setPartyMemberFunc(-(s + 1), getRandomPartyMemberFunc(speciesPool));
    });
    if (specialtyTypes.length) {
      this.setSpeciesFilter((p) => specialtyTypes.find((t) => p.isOfType(t)) !== undefined);
      this.setSpecialtyTypes(...specialtyTypes);
    }
    const nameForCall = this.name.toLowerCase().replace(/\s/g, "_");
    this.name = i18next.t(`trainerNames:${nameForCall}`);
    this.setMoneyMultiplier(2);
    this.setBoss();
    this.setStaticParty();

    // TODO: replace with more suitable music?
    this.setBattleBgm("battle_trainer");
    this.setVictoryBgm("victory_trainer");

    return this;
  }

  /**
   * Initializes the trainer configuration for an evil team leader. Temporarily hardcoding evil leader teams though.
   * @param {Species | Species[]} signatureSpecies The signature species for the evil team leader.
   * @param {Type[]} specialtyTypes The specialty types for the evil team Leader.
   * @param boolean Whether or not this is the rematch fight
   * @returns {TrainerConfig} The updated TrainerConfig instance.
   * **/
  initForEvilTeamLeader(
    title: string,
    signatureSpecies: (Species | Species[])[],
    rematch: boolean = false,
    ...specialtyTypes: Type[]
  ): TrainerConfig {
    if (!getIsInitialized()) {
      initI18n();
    }
    if (rematch) {
      this.setPartyTemplates(trainerPartyTemplates.ELITE_FOUR);
    } else {
      this.setPartyTemplates(trainerPartyTemplates.RIVAL_5);
    }
    signatureSpecies.forEach((speciesPool, s) => {
      if (!Array.isArray(speciesPool)) {
        speciesPool = [speciesPool];
      }
      this.setPartyMemberFunc(-(s + 1), getRandomPartyMemberFunc(speciesPool));
    });
    if (specialtyTypes.length) {
      this.setSpeciesFilter((p) => specialtyTypes.find((t) => p.isOfType(t)) !== undefined);
      this.setSpecialtyTypes(...specialtyTypes);
    }
    const nameForCall = this.name.toLowerCase().replace(/\s/g, "_");
    this.name = i18next.t(`trainerNames:${nameForCall}`);
    this.setTitle(title);
    this.setMoneyMultiplier(2.5);
    this.setBoss();
    this.setStaticParty();
    this.setHasVoucher(true);
    this.setBattleBgm("battle_plasma_boss");
    this.setVictoryBgm("victory_team_plasma");

    return this;
  }

  /**
   * Initializes the trainer configuration for a Gym Leader.
   * @param {Species | Species[]} signatureSpecies The signature species for the Gym Leader.
   * @param {Type[]} specialtyTypes The specialty types for the Gym Leader.
   * @param isMale Whether the Gym Leader is Male or Not (for localization of the title).
   * @returns {TrainerConfig} The updated TrainerConfig instance.
   * **/
  initForGymLeader(
    signatureSpecies: (Species | Species[])[],
    isMale: boolean,
    ...specialtyTypes: Type[]
  ): TrainerConfig {
    // Check if the internationalization (i18n) system is initialized.
    if (!getIsInitialized()) {
      initI18n();
    }

    // Set the function to generate the Gym Leader's party template.
    this.setPartyTemplateFunc(getGymLeaderPartyTemplate);

    // Set up party members with their corresponding species.
    signatureSpecies.forEach((speciesPool, s) => {
      // Ensure speciesPool is an array.
      if (!Array.isArray(speciesPool)) {
        speciesPool = [speciesPool];
      }
      // Set a function to get a random party member from the species pool.
      this.setPartyMemberFunc(-(s + 1), getRandomPartyMemberFunc(speciesPool));
    });

    // If specialty types are provided, set species filter and specialty types.
    if (specialtyTypes.length) {
      this.setSpeciesFilter((p) => specialtyTypes.find((t) => p.isOfType(t)) !== undefined);
      this.setSpecialtyTypes(...specialtyTypes);
    }

    // Localize the trainer's name by converting it to lowercase and replacing spaces with underscores.
    const nameForCall = this.name.toLowerCase().replace(/\s/g, "_");
    this.name = i18next.t(`trainerNames:${nameForCall}`);

    // Set the title to "gym_leader". (this is the key in the i18n file)
    this.setTitle("gym_leader");
    if (!isMale) {
      this.setTitle("gym_leader_female");
    }

    // Configure various properties for the Gym Leader.
    this.setMoneyMultiplier(2.5);
    this.setBoss();
    this.setStaticParty();
    this.setHasVoucher(true);
    this.setBattleBgm("battle_unova_gym");
    this.setVictoryBgm("victory_gym");
    this.setGenModifiersFunc((party) => {
      const waveIndex = globalScene.currentBattle.waveIndex;
      return getRandomTeraModifiers(
        party,
        waveIndex >= 100 ? 1 : 0,
        specialtyTypes.length ? specialtyTypes : undefined,
      );
    });

    return this;
  }

  /**
   * Initializes the trainer configuration for an Elite Four member.
   * @param {Species | Species[]} signatureSpecies The signature species for the Elite Four member.
   * @param {Type[]} specialtyTypes The specialty types for the Elite Four member.
   * @param isMale Whether the Elite Four Member is Male or Female (for localization of the title).
   * @returns {TrainerConfig} The updated TrainerConfig instance.
   **/
  initForEliteFour(
    signatureSpecies: (Species | Species[])[],
    isMale: boolean,
    ...specialtyTypes: Type[]
  ): TrainerConfig {
    // Check if the internationalization (i18n) system is initialized.
    if (!getIsInitialized()) {
      initI18n();
    }

    // Set the party templates for the Elite Four.
    this.setPartyTemplates(trainerPartyTemplates.ELITE_FOUR);

    // Set up party members with their corresponding species.
    signatureSpecies.forEach((speciesPool, s) => {
      // Ensure speciesPool is an array.
      if (!Array.isArray(speciesPool)) {
        speciesPool = [speciesPool];
      }
      // Set a function to get a random party member from the species pool.
      this.setPartyMemberFunc(-(s + 1), getRandomPartyMemberFunc(speciesPool));
    });

    // Set species filter and specialty types if provided, otherwise filter by base total.
    if (specialtyTypes.length) {
      this.setSpeciesFilter((p) => specialtyTypes.some((t) => p.isOfType(t)) && p.baseTotal >= ELITE_FOUR_MINIMUM_BST);
      this.setSpecialtyTypes(...specialtyTypes);
    } else {
      this.setSpeciesFilter((p) => p.baseTotal >= ELITE_FOUR_MINIMUM_BST);
    }

    // Localize the trainer's name by converting it to lowercase and replacing spaces with underscores.
    const nameForCall = this.name.toLowerCase().replace(/\s/g, "_");
    this.name = i18next.t(`trainerNames:${nameForCall}`);

    // Set the title to "elite_four". (this is the key in the i18n file)
    this.setTitle("elite_four");
    if (!isMale) {
      this.setTitle("elite_four_female");
    }

    // Configure various properties for the Elite Four member.
    this.setMoneyMultiplier(3.25);
    this.setBoss();
    this.setStaticParty();
    this.setHasVoucher(true);
    this.setBattleBgm("battle_unova_elite");
    this.setVictoryBgm("victory_gym");
    this.setGenModifiersFunc((party) =>
      getRandomTeraModifiers(party, 2, specialtyTypes.length ? specialtyTypes : undefined),
    );

    return this;
  }

  /**
   * Initializes the trainer configuration for a Champion.
   * @param {Species | Species[]} signatureSpecies The signature species for the Champion.
   * @param isMale Whether the Champion is Male or Female (for localization of the title).
   * @returns {TrainerConfig} The updated TrainerConfig instance.
   **/
  initForChampion(signatureSpecies: (Species | Species[])[], isMale: boolean): TrainerConfig {
    // Check if the internationalization (i18n) system is initialized.
    if (!getIsInitialized()) {
      initI18n();
    }

    // Set the party templates for the Champion.
    this.setPartyTemplates(trainerPartyTemplates.CHAMPION);

    // Set up party members with their corresponding species.
    signatureSpecies.forEach((speciesPool, s) => {
      // Ensure speciesPool is an array.
      if (!Array.isArray(speciesPool)) {
        speciesPool = [speciesPool];
      }
      // Set a function to get a random party member from the species pool.
      this.setPartyMemberFunc(-(s + 1), getRandomPartyMemberFunc(speciesPool));
    });

    this.setSpeciesFilter((p) => p.baseTotal >= CHAMPION_MINIMUM_BST);

    // Localize the trainer's name by converting it to lowercase and replacing spaces with underscores.
    const nameForCall = this.name.toLowerCase().replace(/\s/g, "_");
    this.name = i18next.t(`trainerNames:${nameForCall}`);

    // Set the title to "champion". (this is the key in the i18n file)
    this.setTitle("champion");
    if (!isMale) {
      this.setTitle("champion_female");
    }

    // Configure various properties for the Champion.
    this.setMoneyMultiplier(10);
    this.setBoss();
    this.setStaticParty();
    this.setHasVoucher(true);
    this.setBattleBgm("battle_champion_alder");
    this.setVictoryBgm("victory_champion");
    this.setGenModifiersFunc((party) => getRandomTeraModifiers(party, 3));

    return this;
  }

  /**
   * Sets a localized name for the trainer. This should only be used for trainers that dont use a "initFor" function and are considered "named" trainers
   * @param name - The name of the trainer.
   * @returns {TrainerConfig} The updated TrainerConfig instance.
   */
  setLocalizedName(name: string): TrainerConfig {
    // Check if the internationalization (i18n) system is initialized.
    if (!getIsInitialized()) {
      initI18n();
    }
    this.name = i18next.t(`trainerNames:${name.toLowerCase().replace(/\s/g, "_")}`);
    return this;
  }

  /**
   * Retrieves the title for the trainer based on the provided trainer slot and variant.
   * @param {TrainerSlot} trainerSlot - The slot to determine which title to use. Defaults to TrainerSlot.NONE.
   * @param {TrainerVariant} variant - The variant of the trainer to determine the specific title.
   * @returns {string} - The title of the trainer.
   **/
  getTitle(trainerSlot: TrainerSlot = TrainerSlot.NONE, variant: TrainerVariant): string {
    const ret = this.name;

    // Check if the variant is double and the name for double exists
    if (!trainerSlot && variant === TrainerVariant.DOUBLE && this.nameDouble) {
      return this.nameDouble;
    }

    // Female variant
    if (this.hasGenders) {
      // If the name is already set
      if (this.nameFemale) {
        // Check if the variant is either female or this is for the partner in a double battle
        if (
          variant === TrainerVariant.FEMALE ||
          (variant === TrainerVariant.DOUBLE && trainerSlot === TrainerSlot.TRAINER_PARTNER)
        ) {
          return this.nameFemale;
        }
      } else if (variant) {
        // Check if !variant is true, if so return the name, else return the name with _female appended
        if (!getIsInitialized()) {
          initI18n();
        }
        // Check if the female version exists in the i18n file
        if (i18next.exists(`trainerClasses:${this.name.toLowerCase()}`)) {
          // If it does, return
          return ret + "_female";
        } else {
          // If it doesn't, we do not do anything and go to the normal return
          // This is to prevent the game from displaying an error if a female version of the trainer does not exist in the localization
        }
      }
    }

    return ret;
  }

  loadAssets(variant: TrainerVariant): Promise<void> {
    return new Promise((resolve) => {
      const isDouble = variant === TrainerVariant.DOUBLE;
      const trainerKey = this.getSpriteKey(variant === TrainerVariant.FEMALE, false);
      const partnerTrainerKey = this.getSpriteKey(true, true);
      globalScene.loadAtlas(trainerKey, "trainer");
      if (isDouble) {
        globalScene.loadAtlas(partnerTrainerKey, "trainer");
      }
      globalScene.load.once(Phaser.Loader.Events.COMPLETE, () => {
        const originalWarn = console.warn;
        // Ignore warnings for missing frames, because there will be a lot
        console.warn = () => {};
        const frameNames = globalScene.anims.generateFrameNames(trainerKey, {
          zeroPad: 4,
          suffix: ".png",
          start: 1,
          end: 128,
        });
        const partnerFrameNames = isDouble
          ? globalScene.anims.generateFrameNames(partnerTrainerKey, {
              zeroPad: 4,
              suffix: ".png",
              start: 1,
              end: 128,
            })
          : "";
        console.warn = originalWarn;
        if (!globalScene.anims.exists(trainerKey)) {
          globalScene.anims.create({
            key: trainerKey,
            frames: frameNames,
            frameRate: 24,
            repeat: -1,
          });
        }
        if (isDouble && !globalScene.anims.exists(partnerTrainerKey)) {
          globalScene.anims.create({
            key: partnerTrainerKey,
            frames: partnerFrameNames,
            frameRate: 24,
            repeat: -1,
          });
        }
        resolve();
      });
      if (!globalScene.load.isLoading()) {
        globalScene.load.start();
      }
    });
  }

  /**
   * Creates a shallow copy of a trainer config so that it can be modified without affecting the {@link trainerConfigs} source map
   */
  clone(): TrainerConfig {
    let clone = new TrainerConfig(this.trainerType);
    clone = this.trainerTypeDouble ? clone.setDoubleTrainerType(this.trainerTypeDouble) : clone;
    clone = this.name ? clone.setName(this.name) : clone;
    clone = this.hasGenders ? clone.setHasGenders(this.nameFemale, this.femaleEncounterBgm) : clone;
    clone = this.hasDouble ? clone.setHasDouble(this.nameDouble, this.doubleEncounterBgm) : clone;
    clone = this.title ? clone.setTitle(this.title) : clone;
    clone = this.titleDouble ? clone.setDoubleTitle(this.titleDouble) : clone;
    clone = this.hasCharSprite ? clone.setHasCharSprite() : clone;
    clone = this.doubleOnly ? clone.setDoubleOnly() : clone;
    clone = this.moneyMultiplier ? clone.setMoneyMultiplier(this.moneyMultiplier) : clone;
    clone = this.isBoss ? clone.setBoss() : clone;
    clone = this.hasStaticParty ? clone.setStaticParty() : clone;
    clone = this.useSameSeedForAllMembers ? clone.setUseSameSeedForAllMembers() : clone;
    clone = this.battleBgm ? clone.setBattleBgm(this.battleBgm) : clone;
    clone = this.encounterBgm ? clone.setEncounterBgm(this.encounterBgm) : clone;
    clone = this.victoryBgm ? clone.setVictoryBgm(this.victoryBgm) : clone;
    clone = this.genModifiersFunc ? clone.setGenModifiersFunc(this.genModifiersFunc) : clone;

    if (this.modifierRewardFuncs) {
      // Clones array instead of passing ref
      clone.modifierRewardFuncs = this.modifierRewardFuncs.slice(0);
    }

    if (this.partyTemplates) {
      clone.partyTemplates = this.partyTemplates.slice(0);
    }

    clone = this.partyTemplateFunc ? clone.setPartyTemplateFunc(this.partyTemplateFunc) : clone;

    if (this.partyMemberFuncs) {
      Object.keys(this.partyMemberFuncs).forEach((index) => {
        clone = clone.setPartyMemberFunc(parseInt(index, 10), this.partyMemberFuncs[index]);
      });
    }

    clone = this.speciesPools ? clone.setSpeciesPools(this.speciesPools) : clone;
    clone = this.speciesFilter ? clone.setSpeciesFilter(this.speciesFilter) : clone;
    if (this.specialtyTypes) {
      clone.specialtyTypes = this.specialtyTypes.slice(0);
    }

    clone.encounterMessages = this.encounterMessages?.slice(0);
    clone.victoryMessages = this.victoryMessages?.slice(0);
    clone.defeatMessages = this.defeatMessages?.slice(0);

    clone.femaleEncounterMessages = this.femaleEncounterMessages?.slice(0);
    clone.femaleVictoryMessages = this.femaleVictoryMessages?.slice(0);
    clone.femaleDefeatMessages = this.femaleDefeatMessages?.slice(0);

    clone.doubleEncounterMessages = this.doubleEncounterMessages?.slice(0);
    clone.doubleVictoryMessages = this.doubleVictoryMessages?.slice(0);
    clone.doubleDefeatMessages = this.doubleDefeatMessages?.slice(0);

    return clone;
  }
}

export interface TrainerConfigs {
  [key: number]: TrainerConfig;
}

/**
 * The function to get variable strength grunts
 * @param scene the singleton scene being passed in
 * @returns the correct TrainerPartyTemplate
 */
function getEvilGruntPartyTemplate(): TrainerPartyTemplate {
  const waveIndex = globalScene.currentBattle?.waveIndex;
  if (waveIndex < 40) {
    return trainerPartyTemplates.TWO_AVG;
  } else if (waveIndex < 63) {
    return trainerPartyTemplates.THREE_AVG;
  } else if (waveIndex < 65) {
    return trainerPartyTemplates.TWO_AVG_ONE_STRONG;
  } else if (waveIndex < 112) {
    return trainerPartyTemplates.GYM_LEADER_4; // 3avg 1 strong 1 stronger
  } else {
    return trainerPartyTemplates.GYM_LEADER_5; // 3 avg 2 strong 1 stronger
  }
}

function getWavePartyTemplate(...templates: TrainerPartyTemplate[]) {
  return templates[
    Math.min(
      Math.max(
        Math.ceil(
          (globalScene.gameMode.getWaveForDifficulty(globalScene.currentBattle?.waveIndex || startingWave, true) - 20) /
            30,
        ),
        0,
      ),
      templates.length - 1,
    )
  ];
}

function getGymLeaderPartyTemplate() {
  return getWavePartyTemplate(
    trainerPartyTemplates.GYM_LEADER_1,
    trainerPartyTemplates.GYM_LEADER_2,
    trainerPartyTemplates.GYM_LEADER_3,
    trainerPartyTemplates.GYM_LEADER_4,
    trainerPartyTemplates.GYM_LEADER_5,
  );
}

/**
 * Randomly selects one of the `Species` from `speciesPool`, determines its evolution, level, and strength.
 * Then adds Pokemon to globalScene.
 * @param speciesPool
 * @param trainerSlot
 * @param ignoreEvolution
 * @param postProcess
 */
export function getRandomPartyMemberFunc(
  speciesPool: Species[],
  trainerSlot: TrainerSlot = TrainerSlot.TRAINER,
  ignoreEvolution: boolean = false,
  postProcess?: (enemyPokemon: EnemyPokemon) => void,
) {
  return (level: number, strength: PartyMemberStrength) => {
    let species = Utils.randSeedItem(speciesPool);
    if (!ignoreEvolution) {
      species = getPokemonSpecies(species).getTrainerSpeciesForLevel(
        level,
        true,
        strength,
        globalScene.currentBattle.waveIndex,
      );
    }
    return globalScene.addEnemyPokemon(
      getPokemonSpecies(species),
      level,
      trainerSlot,
      undefined,
      false,
      undefined,
      postProcess,
    );
  };
}

export function getSpeciesFilterRandomPartyMemberFunc(
  originalSpeciesFilter: PokemonSpeciesFilter,
  trainerSlot: TrainerSlot = TrainerSlot.TRAINER,
  allowLegendaries?: boolean,
  postProcess?: (EnemyPokemon: EnemyPokemon) => void,
): PartyMemberFunc {
  const speciesFilter = (species: PokemonSpecies): boolean => {
    const notLegendary = !species.legendary && !species.subLegendary && !species.mythical;
    return (allowLegendaries || notLegendary) && !species.isTrainerForbidden() && originalSpeciesFilter(species);
  };

  return (level: number, strength: PartyMemberStrength) => {
    const waveIndex = globalScene.currentBattle.waveIndex;
    const species = getPokemonSpecies(
      globalScene
        .randomSpecies(waveIndex, level, false, speciesFilter)
        .getTrainerSpeciesForLevel(level, true, strength, waveIndex),
    );

    return globalScene.addEnemyPokemon(species, level, trainerSlot, undefined, false, undefined, postProcess);
  };
}

function getRandomTeraModifiers(party: EnemyPokemon[], count: integer, types?: Type[]): PersistentModifier[] {
  const ret: PersistentModifier[] = [];
  const partyMemberIndexes = new Array(party.length).fill(null).map((_, i) => i);
  for (let t = 0; t < Math.min(count, party.length); t++) {
    const randomIndex = Utils.randSeedItem(partyMemberIndexes);
    partyMemberIndexes.splice(partyMemberIndexes.indexOf(randomIndex), 1);
    ret.push(
      modifierTypes
        .TERA_SHARD()
        .generateType([], [Utils.randSeedItem(types ? types : party[randomIndex].getTypes())])!
        .withIdFromFunc(modifierTypes.TERA_SHARD)
        .newModifier(party[randomIndex]) as PersistentModifier,
    ); // TODO: is the bang correct?
  }
  return ret;
}
