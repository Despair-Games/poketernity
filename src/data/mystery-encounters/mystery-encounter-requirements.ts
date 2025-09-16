import { globalScene } from "#app/global-scene";
import { allAbilities } from "#data/data-lists";
import { pokemonFormChanges } from "#data/pokemon-forms";
import type { AbilityId } from "#enums/ability-id";
import { ElementalType } from "#enums/elemental-type";
import { EvolutionItem } from "#enums/evolution-item";
import { FormChangeItem } from "#enums/form-change-item";
import { MoveId } from "#enums/move-id";
import type { MysteryEncounterType } from "#enums/mystery-encounter-type";
import { Nature } from "#enums/nature";
import { SpeciesFormKey } from "#enums/species-form-key";
import { SpeciesId } from "#enums/species-id";
import { StatusEffect } from "#enums/status-effect";
import { TimeOfDay } from "#enums/time-of-day";
import { WeatherType } from "#enums/weather-type";
import type { PlayerPokemon } from "#field/player-pokemon";
import type { Pokemon } from "#field/pokemon";
import { SpeciesFormChangeItemTrigger } from "#form-change-triggers/species-form-change-item-trigger";
import { pokemonEvolutions } from "#init/init-pokemon-evolutions";
import { coerceArray, enumValueToKey, isNil } from "#utils/common-utils";

export interface EncounterRequirement {
  meetsRequirement(): boolean; // Boolean to see if a requirement is met
  getDialogueToken(pokemon?: PlayerPokemon): [string, string];
}

export abstract class EncounterSceneRequirement implements EncounterRequirement {
  /**
   * Returns whether the EncounterSceneRequirement's... requirements, are met by the given scene
   */
  abstract meetsRequirement(): boolean;
  /**
   * Returns a dialogue token key/value pair for a given Requirement.
   * Should be overridden by child Requirement classes.
   * @param pokemon
   */
  abstract getDialogueToken(pokemon?: PlayerPokemon): [string, string];
}

/**
 * Combination of multiple {@linkcode EncounterSceneRequirement | EncounterSceneRequirements} (OR/AND possible. See {@linkcode isAnd})
 */
export class CombinationSceneRequirement extends EncounterSceneRequirement {
  /** If `true`, all requirements must be met (AND). If `false`, any requirement must be met (OR) */
  private readonly isAnd: boolean;
  requirements: EncounterSceneRequirement[];

  public static Some(...requirements: EncounterSceneRequirement[]): CombinationSceneRequirement {
    return new CombinationSceneRequirement(false, ...requirements);
  }

  public static Every(...requirements: EncounterSceneRequirement[]): CombinationSceneRequirement {
    return new CombinationSceneRequirement(true, ...requirements);
  }

  private constructor(isAnd: boolean, ...requirements: EncounterSceneRequirement[]) {
    super();
    this.isAnd = isAnd;
    this.requirements = requirements;
  }

  /**
   * Checks if all/any requirements are met (depends on {@linkcode isAnd})
   * @returns true if all/any requirements are met (depends on {@linkcode isAnd})
   */
  override meetsRequirement(): boolean {
    return this.isAnd
      ? this.requirements.every((req) => req.meetsRequirement())
      : this.requirements.some((req) => req.meetsRequirement());
  }

  /**
   * Retrieves a dialogue token key/value pair for the given {@linkcode EncounterSceneRequirement | requirements}.
   * @param pokemon The {@linkcode PlayerPokemon} to check against
   * @returns A dialogue token key/value pair
   * @throws An {@linkcode Error} if {@linkcode isAnd} is `true` (not supported)
   */
  override getDialogueToken(pokemon?: PlayerPokemon): [string, string] {
    if (this.isAnd) {
      throw new Error("Not implemented (Sorry)");
    }
    for (const req of this.requirements) {
      if (req.meetsRequirement()) {
        return req.getDialogueToken(pokemon);
      }
    }

    return this.requirements[0].getDialogueToken(pokemon);
  }
}

export abstract class EncounterPokemonRequirement implements EncounterRequirement {
  public minNumberOfPokemon: number;
  public invertQuery: boolean;

  /**
   * Returns whether the EncounterPokemonRequirement's... requirements, are met by the given scene
   */
  abstract meetsRequirement(): boolean;

  /**
   * Returns all party members that are compatible with this requirement. For non pokemon related requirements, the entire party is returned.
   * @param partyPokemon
   */
  abstract queryParty(partyPokemon: PlayerPokemon[]): PlayerPokemon[];

  /**
   * Returns a dialogue token key/value pair for a given Requirement.
   * Should be overridden by child Requirement classes.
   * @param pokemon
   */
  abstract getDialogueToken(pokemon?: PlayerPokemon): [string, string];
}

/**
 * Combination of multiple {@linkcode EncounterPokemonRequirement | EncounterPokemonRequirements} (OR/AND possible. See {@linkcode isAnd})
 */
export class CombinationPokemonRequirement extends EncounterPokemonRequirement {
  /** If `true`, all requirements must be met (AND). If `false`, any requirement must be met (OR) */
  private readonly isAnd: boolean;
  private readonly requirements: EncounterPokemonRequirement[];

  public static Some(...requirements: EncounterPokemonRequirement[]): CombinationPokemonRequirement {
    return new CombinationPokemonRequirement(false, ...requirements);
  }

  public static Every(...requirements: EncounterPokemonRequirement[]): CombinationPokemonRequirement {
    return new CombinationPokemonRequirement(true, ...requirements);
  }

  private constructor(isAnd: boolean, ...requirements: EncounterPokemonRequirement[]) {
    super();
    this.isAnd = isAnd;
    this.invertQuery = false;
    this.minNumberOfPokemon = 1;
    this.requirements = requirements;
  }

  /**
   * Checks if all/any requirements are met (depends on {@linkcode isAnd})
   * @returns true if all/any requirements are met (depends on {@linkcode isAnd})
   */
  override meetsRequirement(): boolean {
    return this.isAnd
      ? this.requirements.every((req) => req.meetsRequirement())
      : this.requirements.some((req) => req.meetsRequirement());
  }

  /**
   * Queries the players party for all party members that are compatible with all/any requirements (depends on {@linkcode isAnd})
   * @param partyPokemon The party of {@linkcode PlayerPokemon}
   * @returns All party members that are compatible with all/any requirements (depends on {@linkcode isAnd})
   */
  override queryParty(partyPokemon: PlayerPokemon[]): PlayerPokemon[] {
    if (this.isAnd) {
      return this.requirements.reduce((relevantPokemon, req) => req.queryParty(relevantPokemon), partyPokemon);
    }
    const matchingRequirement = this.requirements.find((req) => req.queryParty(partyPokemon).length > 0);
    return matchingRequirement ? matchingRequirement.queryParty(partyPokemon) : [];
  }

  /**
   * Retrieves a dialogue token key/value pair for the given {@linkcode EncounterPokemonRequirement | requirements}.
   * @param pokemon The {@linkcode PlayerPokemon} to check against
   * @returns A dialogue token key/value pair
   * @throws An {@linkcode Error} if {@linkcode isAnd} is `true` (not supported)
   */
  override getDialogueToken(pokemon?: PlayerPokemon): [string, string] {
    if (this.isAnd) {
      throw new Error("Not implemented (Sorry)");
    }
    for (const req of this.requirements) {
      if (req.meetsRequirement()) {
        return req.getDialogueToken(pokemon);
      }
    }

    return this.requirements[0].getDialogueToken(pokemon);
  }
}

export class PreviousEncounterRequirement extends EncounterSceneRequirement {
  previousEncounterRequirement: MysteryEncounterType;

  /**
   * Used for specifying an encounter that must be seen before this encounter can spawn
   * @param previousEncounterRequirement
   */
  constructor(previousEncounterRequirement: MysteryEncounterType) {
    super();
    this.previousEncounterRequirement = previousEncounterRequirement;
  }

  override meetsRequirement(): boolean {
    return globalScene.mysteryEncounterSaveData.encounteredEvents.some(
      (e) => e.type === this.previousEncounterRequirement,
    );
  }

  override getDialogueToken(_pokemon?: PlayerPokemon): [string, string] {
    return [
      "previousEncounter",
      globalScene.mysteryEncounterSaveData.encounteredEvents
        .find((e) => e.type === this.previousEncounterRequirement)?.[0]
        .toString() ?? "",
    ];
  }
}

export class WaveRangeRequirement extends EncounterSceneRequirement {
  waveRange: [number, number];

  /**
   * Used for specifying a unique wave or wave range requirement
   * If minWaveIndex and maxWaveIndex are equivalent, will check for exact wave number
   * @param waveRange [min, max]
   */
  constructor(waveRange: [number, number]) {
    super();
    this.waveRange = waveRange;
  }

  override meetsRequirement(): boolean {
    if (!isNil(this.waveRange) && this.waveRange[0] <= this.waveRange[1]) {
      const waveIndex = globalScene.currentBattle.waveIndex;
      if (
        (waveIndex >= 0 && this.waveRange[0] >= 0 && this.waveRange[0] > waveIndex)
        || (this.waveRange[1] >= 0 && this.waveRange[1] < waveIndex)
      ) {
        return false;
      }
    }
    return true;
  }

  override getDialogueToken(_pokemon?: PlayerPokemon): [string, string] {
    return ["waveIndex", globalScene.currentBattle.waveIndex.toString()];
  }
}

export class WaveModulusRequirement extends EncounterSceneRequirement {
  waveModuli: number[];
  modulusValue: number;

  /**
   * Used for specifying a modulus requirement on the wave index
   * For example, can be used to require the wave index to end with 1, 2, or 3
   * @param waveModuli The allowed modulus results
   * @param modulusValue The modulus calculation value
   *
   * Example:
   * new WaveModulusRequirement([1, 2, 3], 10) will check for 1st/2nd/3rd waves that are immediately after a multiple of 10 wave
   * So waves 21, 32, 53 all return true. 58, 14, 99 return false.
   */
  constructor(waveModuli: number[], modulusValue: number) {
    super();
    this.waveModuli = waveModuli;
    this.modulusValue = modulusValue;
  }

  override meetsRequirement(): boolean {
    return this.waveModuli.includes(globalScene.currentBattle.waveIndex % this.modulusValue);
  }

  override getDialogueToken(_pokemon?: PlayerPokemon): [string, string] {
    return ["waveIndex", globalScene.currentBattle.waveIndex.toString()];
  }
}

export class TimeOfDayRequirement extends EncounterSceneRequirement {
  requiredTimeOfDay: TimeOfDay[];

  constructor(timeOfDay: TimeOfDay | TimeOfDay[]) {
    super();
    this.requiredTimeOfDay = coerceArray(timeOfDay);
  }

  override meetsRequirement(): boolean {
    const timeOfDay = globalScene.arena?.getTimeOfDay();
    if (!isNil(timeOfDay) && this.requiredTimeOfDay?.length > 0 && !this.requiredTimeOfDay.includes(timeOfDay)) {
      return false;
    }

    return true;
  }

  override getDialogueToken(_pokemon?: PlayerPokemon): [string, string] {
    return ["timeOfDay", TimeOfDay[globalScene.arena.getTimeOfDay()].toLocaleLowerCase()];
  }
}

export class WeatherRequirement extends EncounterSceneRequirement {
  requiredWeather: WeatherType[];

  constructor(weather: WeatherType | WeatherType[]) {
    super();
    this.requiredWeather = coerceArray(weather);
  }

  override meetsRequirement(): boolean {
    const currentWeather = globalScene.arena.weather?.weatherType;
    if (!isNil(currentWeather) && this.requiredWeather?.length > 0 && !this.requiredWeather.includes(currentWeather!)) {
      return false;
    }

    return true;
  }

  override getDialogueToken(_pokemon?: PlayerPokemon): [string, string] {
    const currentWeather = globalScene.arena.weather?.weatherType;
    let token = "";
    if (!isNil(currentWeather)) {
      token = WeatherType[currentWeather].replace("_", " ").toLocaleLowerCase();
    }
    return ["weather", token];
  }
}

export class PartySizeRequirement extends EncounterSceneRequirement {
  partySizeRange: [number, number];
  excludeDisallowedPokemon: boolean;

  /**
   * Used for specifying a party size requirement
   * If min and max are equivalent, will check for exact size
   * @param partySizeRange
   * @param excludeDisallowedPokemon
   */
  constructor(partySizeRange: [number, number], excludeDisallowedPokemon: boolean) {
    super();
    this.partySizeRange = partySizeRange;
    this.excludeDisallowedPokemon = excludeDisallowedPokemon;
  }

  override meetsRequirement(): boolean {
    if (!isNil(this.partySizeRange) && this.partySizeRange[0] <= this.partySizeRange[1]) {
      const partySize = this.excludeDisallowedPokemon
        ? globalScene.getPokemonAllowedInBattle().length
        : globalScene.getPlayerParty().length;
      if (
        (partySize >= 0 && this.partySizeRange[0] >= 0 && this.partySizeRange[0] > partySize)
        || (this.partySizeRange[1] >= 0 && this.partySizeRange[1] < partySize)
      ) {
        return false;
      }
    }

    return true;
  }

  override getDialogueToken(_pokemon?: PlayerPokemon): [string, string] {
    return ["partySize", globalScene.getPlayerParty().length.toString()];
  }
}

export class PersistentModifierRequirement extends EncounterSceneRequirement {
  requiredHeldItemModifiers: string[];
  minNumberOfItems: number;

  constructor(heldItem: string | string[], minNumberOfItems: number = 1) {
    super();
    this.minNumberOfItems = minNumberOfItems;
    this.requiredHeldItemModifiers = coerceArray(heldItem);
  }

  override meetsRequirement(): boolean {
    const partyPokemon = globalScene.getPlayerParty();
    if (isNil(partyPokemon) || this.requiredHeldItemModifiers?.length < 0) {
      return false;
    }
    let modifierCount = 0;
    this.requiredHeldItemModifiers.forEach((modifier) => {
      const matchingMods = globalScene.findModifiers((m) => m.constructor.name === modifier);
      if (matchingMods?.length > 0) {
        matchingMods.forEach((matchingMod) => {
          modifierCount += matchingMod.stackCount;
        });
      }
    });

    return modifierCount >= this.minNumberOfItems;
  }

  override getDialogueToken(_pokemon?: PlayerPokemon): [string, string] {
    return ["requiredItem", this.requiredHeldItemModifiers[0]];
  }
}

export class MoneyRequirement extends EncounterSceneRequirement {
  requiredMoney: number; // Static value
  /** Calculates required money based off wave index */
  scalingMultiplier: number;

  constructor(requiredMoney: number, scalingMultiplier?: number) {
    super();
    this.requiredMoney = requiredMoney ?? 0;
    this.scalingMultiplier = scalingMultiplier ?? 0;
  }

  override meetsRequirement(): boolean {
    const money = globalScene.money;
    if (isNil(money)) {
      return false;
    }

    if (this.scalingMultiplier > 0) {
      this.requiredMoney = globalScene.getWaveMoneyAmount(this.scalingMultiplier);
    }
    return !(this.requiredMoney > 0 && this.requiredMoney > money);
  }

  override getDialogueToken(_pokemon?: PlayerPokemon): [string, string] {
    const value =
      this.scalingMultiplier > 0
        ? globalScene.getWaveMoneyAmount(this.scalingMultiplier).toString()
        : this.requiredMoney.toString();
    return ["money", value];
  }
}

export class SpeciesRequirement extends EncounterPokemonRequirement {
  requiredSpecies: SpeciesId[];

  constructor(species: SpeciesId | SpeciesId[], minNumberOfPokemon: number = 1, invertQuery: boolean = false) {
    super();
    this.minNumberOfPokemon = minNumberOfPokemon;
    this.invertQuery = invertQuery;
    this.requiredSpecies = coerceArray(species);
  }

  override meetsRequirement(): boolean {
    const partyPokemon = globalScene.getPlayerParty();
    if (isNil(partyPokemon) || this.requiredSpecies?.length < 0) {
      return false;
    }
    return this.queryParty(partyPokemon).length >= this.minNumberOfPokemon;
  }

  override queryParty(partyPokemon: PlayerPokemon[]): PlayerPokemon[] {
    if (!this.invertQuery) {
      return partyPokemon.filter(
        (pokemon) => this.requiredSpecies.filter((species) => pokemon.species.speciesId === species).length > 0,
      );
    }
    // for an inverted query, we only want to get the pokemon that don't have ANY of the listed speciess
    return partyPokemon.filter(
      (pokemon) => this.requiredSpecies.filter((species) => pokemon.species.speciesId === species).length === 0,
    );
  }

  override getDialogueToken(pokemon?: PlayerPokemon): [string, string] {
    if (pokemon?.species.speciesId && this.requiredSpecies.includes(pokemon.species.speciesId)) {
      return ["species", SpeciesId[pokemon.species.speciesId]];
    }
    return ["species", ""];
  }
}

export class NatureRequirement extends EncounterPokemonRequirement {
  requiredNature: Nature[];

  constructor(nature: Nature | Nature[], minNumberOfPokemon: number = 1, invertQuery: boolean = false) {
    super();
    this.minNumberOfPokemon = minNumberOfPokemon;
    this.invertQuery = invertQuery;
    this.requiredNature = coerceArray(nature);
  }

  override meetsRequirement(): boolean {
    const partyPokemon = globalScene.getPlayerParty();
    if (isNil(partyPokemon) || this.requiredNature?.length < 0) {
      return false;
    }
    return this.queryParty(partyPokemon).length >= this.minNumberOfPokemon;
  }

  override queryParty(partyPokemon: PlayerPokemon[]): PlayerPokemon[] {
    if (!this.invertQuery) {
      return partyPokemon.filter(
        (pokemon) => this.requiredNature.filter((nature) => pokemon.nature === nature).length > 0,
      );
    }
    // for an inverted query, we only want to get the pokemon that don't have ANY of the listed natures
    return partyPokemon.filter(
      (pokemon) => this.requiredNature.filter((nature) => pokemon.nature === nature).length === 0,
    );
  }

  override getDialogueToken(pokemon?: PlayerPokemon): [string, string] {
    if (!isNil(pokemon?.nature) && this.requiredNature.includes(pokemon.nature)) {
      return ["nature", Nature[pokemon.nature]];
    }
    return ["nature", ""];
  }
}

export class TypeRequirement extends EncounterPokemonRequirement {
  requiredType: ElementalType[];
  excludeFainted: boolean;

  constructor(
    type: ElementalType | ElementalType[],
    excludeFainted: boolean = true,
    minNumberOfPokemon: number = 1,
    invertQuery: boolean = false,
  ) {
    super();
    this.excludeFainted = excludeFainted;
    this.minNumberOfPokemon = minNumberOfPokemon;
    this.invertQuery = invertQuery;
    this.requiredType = coerceArray(type);
  }

  override meetsRequirement(): boolean {
    let partyPokemon = globalScene.getPlayerParty();

    if (isNil(partyPokemon)) {
      return false;
    }

    if (this.excludeFainted) {
      partyPokemon = partyPokemon.filter((pokemon) => !pokemon.isFainted());
    }

    return this.queryParty(partyPokemon).length >= this.minNumberOfPokemon;
  }

  override queryParty(partyPokemon: PlayerPokemon[]): PlayerPokemon[] {
    if (!this.invertQuery) {
      return partyPokemon.filter(
        (pokemon) => this.requiredType.filter((type) => pokemon.getTypes().includes(type)).length > 0,
      );
    }
    // for an inverted query, we only want to get the pokemon that don't have ANY of the listed types
    return partyPokemon.filter(
      (pokemon) => this.requiredType.filter((type) => pokemon.getTypes().includes(type)).length === 0,
    );
  }

  override getDialogueToken(pokemon?: PlayerPokemon): [string, string] {
    const includedTypes = this.requiredType.filter((ty) => pokemon?.getTypes().includes(ty));
    if (includedTypes.length > 0) {
      return ["type", enumValueToKey(ElementalType, includedTypes[0])];
    }
    return ["type", ""];
  }
}

export class MoveRequirement extends EncounterPokemonRequirement {
  requiredMoves: MoveId[] = [];
  excludeDisallowedPokemon: boolean;

  constructor(
    moves: MoveId | MoveId[],
    excludeDisallowedPokemon: boolean,
    minNumberOfPokemon: number = 1,
    invertQuery: boolean = false,
  ) {
    super();
    this.excludeDisallowedPokemon = excludeDisallowedPokemon;
    this.minNumberOfPokemon = minNumberOfPokemon;
    this.invertQuery = invertQuery;
    this.requiredMoves = coerceArray(moves);
  }

  override meetsRequirement(): boolean {
    const partyPokemon = globalScene.getPlayerParty();
    if (isNil(partyPokemon) || this.requiredMoves?.length < 0) {
      return false;
    }
    return this.queryParty(partyPokemon).length >= this.minNumberOfPokemon;
  }

  override queryParty(partyPokemon: PlayerPokemon[]): PlayerPokemon[] {
    return partyPokemon.filter((pokemon) => {
      const movesetFilter = pokemon
        .getMoveset(true)
        .some((move) => move.moveId && this.requiredMoves.includes(move.moveId));
      const pokemonIsAllowed = !this.excludeDisallowedPokemon || pokemon.isAllowedInBattle();
      return pokemonIsAllowed && (this.invertQuery ? !movesetFilter : movesetFilter);
    });
  }

  override getDialogueToken(pokemon?: PlayerPokemon): [string, string] {
    if (!pokemon) {
      return ["move", ""];
    }
    const includedMoves = pokemon
      .getMoveset(true)
      .filter((move) => move.moveId && this.requiredMoves.includes(move.moveId));
    if (includedMoves && includedMoves.length > 0 && includedMoves[0]) {
      return ["move", includedMoves[0].name];
    }
    return ["move", ""];
  }
}

/**
 * Find out if Pokemon in the party are able to learn one of many specific moves by TM.
 * NOTE: Egg moves are not included as learnable.
 * NOTE: If the Pokemon already knows the move, this requirement will fail, since it's not technically learnable.
 */
export class CompatibleMoveRequirement extends EncounterPokemonRequirement {
  requiredMoves: MoveId[];

  constructor(learnableMoveId: MoveId | MoveId[], minNumberOfPokemon: number = 1, invertQuery: boolean = false) {
    super();
    this.minNumberOfPokemon = minNumberOfPokemon;
    this.invertQuery = invertQuery;
    this.requiredMoves = coerceArray(learnableMoveId);
  }

  override meetsRequirement(): boolean {
    const partyPokemon = globalScene.getPlayerParty();
    if (isNil(partyPokemon) || this.requiredMoves?.length < 0) {
      return false;
    }
    return this.queryParty(partyPokemon).length >= this.minNumberOfPokemon;
  }

  override queryParty(partyPokemon: PlayerPokemon[]): PlayerPokemon[] {
    if (!this.invertQuery) {
      return partyPokemon.filter(
        (pokemon) =>
          this.requiredMoves.filter((learnableMove) =>
            pokemon.compatibleTms
              .filter((tm) => !pokemon.getMoveset(true).find((m) => m.moveId === tm))
              .includes(learnableMove),
          ).length > 0,
      );
    }
    // for an inverted query, we only want to get the pokemon that don't have ANY of the listed learnableMoves
    return partyPokemon.filter(
      (pokemon) =>
        this.requiredMoves.filter((learnableMove) =>
          pokemon.compatibleTms
            .filter((tm) => !pokemon.getMoveset(true).find((m) => m.moveId === tm))
            .includes(learnableMove),
        ).length === 0,
    );
  }

  override getDialogueToken(pokemon?: PlayerPokemon): [string, string] {
    if (!pokemon) {
      return ["compatibleMove", ""];
    }
    const includedCompatMoves = this.requiredMoves.filter((reqMove) =>
      pokemon.compatibleTms.filter((tm) => !pokemon.getMoveset(true).find((m) => m.moveId === tm)).includes(reqMove),
    );
    if (includedCompatMoves.length > 0) {
      return ["compatibleMove", MoveId[includedCompatMoves[0]]];
    }
    return ["compatibleMove", ""];
  }
}

export class AbilityRequirement extends EncounterPokemonRequirement {
  requiredAbilities: AbilityId[];
  excludeDisallowedPokemon: boolean;

  constructor(
    abilities: AbilityId | AbilityId[],
    excludeDisallowedPokemon: boolean,
    minNumberOfPokemon: number = 1,
    invertQuery: boolean = false,
  ) {
    super();
    this.excludeDisallowedPokemon = excludeDisallowedPokemon;
    this.minNumberOfPokemon = minNumberOfPokemon;
    this.invertQuery = invertQuery;
    this.requiredAbilities = coerceArray(abilities);
  }

  override meetsRequirement(): boolean {
    const partyPokemon = globalScene.getPlayerParty();
    if (isNil(partyPokemon) || this.requiredAbilities?.length < 0) {
      return false;
    }
    return this.queryParty(partyPokemon).length >= this.minNumberOfPokemon;
  }

  override queryParty(partyPokemon: PlayerPokemon[]): PlayerPokemon[] {
    return partyPokemon.filter((pokemon) => {
      const pokemonIsAllowed = !this.excludeDisallowedPokemon || pokemon.isAllowedInBattle();
      const pokemonHasAbility = this.requiredAbilities.some((ability) => pokemon.hasAbility(ability, false));
      return pokemonIsAllowed && (this.invertQuery ? !pokemonHasAbility : pokemonHasAbility);
    });
  }

  override getDialogueToken(pokemon?: PlayerPokemon): [string, string] {
    const matchingAbility = this.requiredAbilities.find((a) => pokemon?.hasAbility(a, false));
    if (!isNil(matchingAbility)) {
      return ["ability", allAbilities[matchingAbility].name];
    }
    return ["ability", ""];
  }
}

export class StatusEffectRequirement extends EncounterPokemonRequirement {
  requiredStatusEffect: StatusEffect[];

  constructor(
    statusEffect: StatusEffect | StatusEffect[],
    minNumberOfPokemon: number = 1,
    invertQuery: boolean = false,
  ) {
    super();
    this.minNumberOfPokemon = minNumberOfPokemon;
    this.invertQuery = invertQuery;
    this.requiredStatusEffect = coerceArray(statusEffect);
  }

  override meetsRequirement(): boolean {
    const partyPokemon = globalScene.getPlayerParty();
    if (isNil(partyPokemon) || this.requiredStatusEffect?.length < 0) {
      return false;
    }
    const x = this.queryParty(partyPokemon).length >= this.minNumberOfPokemon;
    console.log(x);
    return x;
  }

  override queryParty(partyPokemon: PlayerPokemon[]): PlayerPokemon[] {
    return partyPokemon.filter((pokemon) => {
      const effectFilter = this.requiredStatusEffect.some((statusEffect) => {
        if (statusEffect === StatusEffect.NONE) {
          // StatusEffect.NONE also checks for null or undefined status
          return !pokemon.hasNonVolatileStatusEffect();
        }
        return pokemon.hasStatusEffect(statusEffect);
      });
      return this.invertQuery ? !effectFilter : effectFilter;
    });
  }

  override getDialogueToken(pokemon?: PlayerPokemon): [string, string] {
    const reqStatus = this.requiredStatusEffect.filter((a) => {
      if (a === StatusEffect.NONE) {
        return pokemon && !pokemon.hasNonVolatileStatusEffect();
      }
      return pokemon?.hasStatusEffect(a);
    });
    if (reqStatus.length > 0) {
      return ["status", StatusEffect[reqStatus[0]]];
    }
    return ["status", ""];
  }
}

/**
 * Finds if there are pokemon that can form change with a given item.
 * Notice that we mean specific items, like Charizardite, not the Mega Bracelet.
 * If you want to trigger the event based on the form change enabler, use PersistentModifierRequirement.
 */
export class CanFormChangeWithItemRequirement extends EncounterPokemonRequirement {
  requiredFormChangeItem: FormChangeItem[];

  constructor(
    formChangeItem: FormChangeItem | FormChangeItem[],
    minNumberOfPokemon: number = 1,
    invertQuery: boolean = false,
  ) {
    super();
    this.minNumberOfPokemon = minNumberOfPokemon;
    this.invertQuery = invertQuery;
    this.requiredFormChangeItem = coerceArray(formChangeItem);
  }

  override meetsRequirement(): boolean {
    const partyPokemon = globalScene.getPlayerParty();
    if (isNil(partyPokemon) || this.requiredFormChangeItem?.length < 0) {
      return false;
    }
    return this.queryParty(partyPokemon).length >= this.minNumberOfPokemon;
  }

  /**
   * Get all form changes for this species with an item trigger, including any compound triggers.
   * @param pokemon - The {@linkcode PlayerPokemon} to check
   * @param formChangeItem - The {@linkcode FormChangeItem} to check for
   * @returns `true` if any form changes match this item
   */
  filterByForm(pokemon: PlayerPokemon, formChangeItem: FormChangeItem): boolean {
    if (
      Object.hasOwn(pokemonFormChanges, pokemon.species.speciesId)
      && pokemonFormChanges[pokemon.species.speciesId]
        .filter((fc) => fc.trigger.hasTriggerType(SpeciesFormChangeItemTrigger))
        .flatMap((fc) => fc.findTrigger(SpeciesFormChangeItemTrigger) as SpeciesFormChangeItemTrigger)
        .flatMap((fc) => fc.item)
        .includes(formChangeItem)
    ) {
      return true;
    }
    return false;
  }

  override queryParty(partyPokemon: PlayerPokemon[]): PlayerPokemon[] {
    if (!this.invertQuery) {
      return partyPokemon.filter(
        (pokemon) =>
          this.requiredFormChangeItem.filter((formChangeItem) => this.filterByForm(pokemon, formChangeItem)).length > 0,
      );
    }
    // for an inverted query, we only want to get the pokemon that don't have ANY of the listed formChangeItems
    return partyPokemon.filter(
      (pokemon) =>
        this.requiredFormChangeItem.filter((formChangeItem) => this.filterByForm(pokemon, formChangeItem)).length === 0,
    );
  }

  // TODO: surely `pokemon` shouldn't be able to be `undefined`?
  override getDialogueToken(pokemon?: PlayerPokemon): [string, string] {
    if (!pokemon) {
      return ["formChangeItem", ""];
    }
    const requiredItems = this.requiredFormChangeItem.filter((formChangeItem) =>
      this.filterByForm(pokemon, formChangeItem),
    );
    if (requiredItems.length > 0) {
      return ["formChangeItem", FormChangeItem[requiredItems[0]]];
    }
    return ["formChangeItem", ""];
  }
}

export class CanEvolveWithItemRequirement extends EncounterPokemonRequirement {
  requiredEvolutionItem: EvolutionItem[];

  constructor(
    evolutionItems: EvolutionItem | EvolutionItem[],
    minNumberOfPokemon: number = 1,
    invertQuery: boolean = false,
  ) {
    super();
    this.minNumberOfPokemon = minNumberOfPokemon;
    this.invertQuery = invertQuery;
    this.requiredEvolutionItem = coerceArray(evolutionItems);
  }

  override meetsRequirement(): boolean {
    const partyPokemon = globalScene.getPlayerParty();
    if (isNil(partyPokemon) || this.requiredEvolutionItem?.length < 0) {
      return false;
    }
    return this.queryParty(partyPokemon).length >= this.minNumberOfPokemon;
  }

  // TODO: clean up MEs...
  filterByEvo(pokemon: Pokemon | undefined, evolutionItem) {
    if (!pokemon) {
      return false;
    }
    if (
      Object.hasOwn(pokemonEvolutions, pokemon.species.speciesId)
      && pokemonEvolutions[pokemon.species.speciesId].filter(
        (e) =>
          e.item === evolutionItem
          && (!e.conditions || e.conditions.every((condition) => condition.predicate(pokemon))),
      ).length
      && pokemon.getFormKey() !== SpeciesFormKey.GIGANTAMAX
    ) {
      return true;
    }
    return false;
  }

  override queryParty(partyPokemon: PlayerPokemon[]): PlayerPokemon[] {
    if (!this.invertQuery) {
      return partyPokemon.filter(
        (pokemon) =>
          this.requiredEvolutionItem.filter((evolutionItem) => this.filterByEvo(pokemon, evolutionItem)).length > 0,
      );
    }
    // for an inverted query, we only want to get the pokemon that don't have ANY of the listed evolutionItemss
    return partyPokemon.filter(
      (pokemon) =>
        this.requiredEvolutionItem.filter((evolutionItems) => this.filterByEvo(pokemon, evolutionItems)).length === 0,
    );
  }

  override getDialogueToken(pokemon?: PlayerPokemon): [string, string] {
    const requiredItems = this.requiredEvolutionItem.filter((evoItem) => this.filterByEvo(pokemon, evoItem));
    if (requiredItems.length > 0) {
      return ["evolutionItem", EvolutionItem[requiredItems[0]]];
    }
    return ["evolutionItem", ""];
  }
}

export class HeldItemRequirement extends EncounterPokemonRequirement {
  requiredHeldItemModifiers: string[];
  requireTransferable: boolean;

  constructor(
    heldItem: string | string[],
    minNumberOfPokemon: number = 1,
    invertQuery: boolean = false,
    requireTransferable: boolean = true,
  ) {
    super();
    this.minNumberOfPokemon = minNumberOfPokemon;
    this.invertQuery = invertQuery;
    this.requiredHeldItemModifiers = coerceArray(heldItem);
    this.requireTransferable = requireTransferable;
  }

  override meetsRequirement(): boolean {
    const partyPokemon = globalScene.getPlayerParty();
    if (isNil(partyPokemon)) {
      return false;
    }
    return this.queryParty(partyPokemon).length >= this.minNumberOfPokemon;
  }

  override queryParty(partyPokemon: PlayerPokemon[]): PlayerPokemon[] {
    if (!this.invertQuery) {
      return partyPokemon.filter((pokemon) =>
        this.requiredHeldItemModifiers.some((heldItem) => {
          return pokemon.getHeldItems().some((it) => {
            return it.constructor.name === heldItem && (!this.requireTransferable || it.isTransferable);
          });
        }),
      );
    }
    // for an inverted query, we only want to get the pokemon that have any held items that are NOT in requiredHeldItemModifiers
    // E.g. functions as a blacklist
    return partyPokemon.filter(
      (pokemon) =>
        pokemon.getHeldItems().filter((it) => {
          return (
            !this.requiredHeldItemModifiers.some((heldItem) => it.constructor.name === heldItem)
            && (!this.requireTransferable || it.isTransferable)
          );
        }).length > 0,
    );
  }

  override getDialogueToken(pokemon?: PlayerPokemon): [string, string] {
    const requiredItems = pokemon?.getHeldItems().filter((it) => {
      return (
        this.requiredHeldItemModifiers.some((heldItem) => it.constructor.name === heldItem)
        && (!this.requireTransferable || it.isTransferable)
      );
    });
    if (requiredItems && requiredItems.length > 0) {
      return ["heldItem", requiredItems[0].type.name];
    }
    return ["heldItem", ""];
  }
}

export class AttackTypeBoosterHeldItemTypeRequirement extends EncounterPokemonRequirement {
  requiredHeldItemTypes: ElementalType[];
  requireTransferable: boolean;

  constructor(
    heldItemTypes: ElementalType | ElementalType[],
    minNumberOfPokemon: number = 1,
    invertQuery: boolean = false,
    requireTransferable: boolean = true,
  ) {
    super();
    this.minNumberOfPokemon = minNumberOfPokemon;
    this.invertQuery = invertQuery;
    this.requiredHeldItemTypes = coerceArray(heldItemTypes);
    this.requireTransferable = requireTransferable;
  }

  override meetsRequirement(): boolean {
    const partyPokemon = globalScene.getPlayerParty();
    if (isNil(partyPokemon)) {
      return false;
    }
    return this.queryParty(partyPokemon).length >= this.minNumberOfPokemon;
  }

  override queryParty(partyPokemon: PlayerPokemon[]): PlayerPokemon[] {
    if (!this.invertQuery) {
      return partyPokemon.filter((pokemon) =>
        this.requiredHeldItemTypes.some((heldItemType) => {
          return pokemon.getHeldItems().some((it) => {
            return (
              it.isAttackTypeBoosterModifier()
              && it.type.moveType === heldItemType
              && (!this.requireTransferable || it.isTransferable)
            );
          });
        }),
      );
    }
    // for an inverted query, we only want to get the pokemon that have any held items that are NOT in requiredHeldItemModifiers
    // E.g. functions as a blacklist
    return partyPokemon.filter(
      (pokemon) =>
        pokemon.getHeldItems().filter((it) => {
          return !this.requiredHeldItemTypes.some(
            (heldItemType) =>
              it.isAttackTypeBoosterModifier()
              && it.type.moveType === heldItemType
              && (!this.requireTransferable || it.isTransferable),
          );
        }).length > 0,
    );
  }

  override getDialogueToken(pokemon?: PlayerPokemon): [string, string] {
    const requiredItems = pokemon?.getHeldItems().filter((it) => {
      return (
        this.requiredHeldItemTypes.some(
          (heldItemType) => it.isAttackTypeBoosterModifier() && it.type.moveType === heldItemType,
        )
        && (!this.requireTransferable || it.isTransferable)
      );
    });
    if (requiredItems && requiredItems.length > 0) {
      return ["heldItem", requiredItems[0].type.name];
    }
    return ["heldItem", ""];
  }
}

export class LevelRequirement extends EncounterPokemonRequirement {
  requiredLevelRange: [number, number];

  constructor(requiredLevelRange: [number, number], minNumberOfPokemon: number = 1, invertQuery: boolean = false) {
    super();
    this.minNumberOfPokemon = minNumberOfPokemon;
    this.invertQuery = invertQuery;
    this.requiredLevelRange = requiredLevelRange;
  }

  override meetsRequirement(): boolean {
    // Party Pokemon inside required level range
    if (!isNil(this.requiredLevelRange) && this.requiredLevelRange[0] <= this.requiredLevelRange[1]) {
      const partyPokemon = globalScene.getPlayerParty();
      const pokemonInRange = this.queryParty(partyPokemon);
      if (pokemonInRange.length < this.minNumberOfPokemon) {
        return false;
      }
    }
    return true;
  }

  override queryParty(partyPokemon: PlayerPokemon[]): PlayerPokemon[] {
    if (!this.invertQuery) {
      return partyPokemon.filter(
        (pokemon) => pokemon.level >= this.requiredLevelRange[0] && pokemon.level <= this.requiredLevelRange[1],
      );
    }
    // for an inverted query, we only want to get the pokemon that don't have ANY of the listed requiredLevelRanges
    return partyPokemon.filter(
      (pokemon) => pokemon.level < this.requiredLevelRange[0] || pokemon.level > this.requiredLevelRange[1],
    );
  }

  override getDialogueToken(pokemon?: PlayerPokemon): [string, string] {
    return ["level", pokemon?.level.toString() ?? ""];
  }
}

export class FriendshipRequirement extends EncounterPokemonRequirement {
  requiredFriendshipRange: [number, number];

  constructor(requiredFriendshipRange: [number, number], minNumberOfPokemon: number = 1, invertQuery: boolean = false) {
    super();
    this.minNumberOfPokemon = minNumberOfPokemon;
    this.invertQuery = invertQuery;
    this.requiredFriendshipRange = requiredFriendshipRange;
  }

  override meetsRequirement(): boolean {
    // Party Pokemon inside required friendship range
    if (!isNil(this.requiredFriendshipRange) && this.requiredFriendshipRange[0] <= this.requiredFriendshipRange[1]) {
      const partyPokemon = globalScene.getPlayerParty();
      const pokemonInRange = this.queryParty(partyPokemon);
      if (pokemonInRange.length < this.minNumberOfPokemon) {
        return false;
      }
    }
    return true;
  }

  override queryParty(partyPokemon: PlayerPokemon[]): PlayerPokemon[] {
    if (!this.invertQuery) {
      return partyPokemon.filter(
        (pokemon) =>
          pokemon.friendship >= this.requiredFriendshipRange[0]
          && pokemon.friendship <= this.requiredFriendshipRange[1],
      );
    }
    // for an inverted query, we only want to get the pokemon that don't have ANY of the listed requiredFriendshipRanges
    return partyPokemon.filter(
      (pokemon) =>
        pokemon.friendship < this.requiredFriendshipRange[0] || pokemon.friendship > this.requiredFriendshipRange[1],
    );
  }

  override getDialogueToken(pokemon?: PlayerPokemon): [string, string] {
    return ["friendship", pokemon?.friendship.toString() ?? ""];
  }
}

/**
 * .1 -> 10% hp
 * .5 -> 50% hp
 * 1 -> 100% hp
 */
export class HealthRatioRequirement extends EncounterPokemonRequirement {
  requiredHealthRange: [number, number];

  constructor(requiredHealthRange: [number, number], minNumberOfPokemon: number = 1, invertQuery: boolean = false) {
    super();
    this.minNumberOfPokemon = minNumberOfPokemon;
    this.invertQuery = invertQuery;
    this.requiredHealthRange = requiredHealthRange;
  }

  override meetsRequirement(): boolean {
    // Party Pokemon's health inside required health range
    if (!isNil(this.requiredHealthRange) && this.requiredHealthRange[0] <= this.requiredHealthRange[1]) {
      const partyPokemon = globalScene.getPlayerParty();
      const pokemonInRange = this.queryParty(partyPokemon);
      if (pokemonInRange.length < this.minNumberOfPokemon) {
        return false;
      }
    }
    return true;
  }

  override queryParty(partyPokemon: PlayerPokemon[]): PlayerPokemon[] {
    if (!this.invertQuery) {
      return partyPokemon.filter((pokemon) => {
        return (
          pokemon.getHpRatio() >= this.requiredHealthRange[0] && pokemon.getHpRatio() <= this.requiredHealthRange[1]
        );
      });
    }
    // for an inverted query, we only want to get the pokemon that don't have ANY of the listed requiredHealthRanges
    return partyPokemon.filter(
      (pokemon) =>
        pokemon.getHpRatio() < this.requiredHealthRange[0] || pokemon.getHpRatio() > this.requiredHealthRange[1],
    );
  }

  override getDialogueToken(pokemon?: PlayerPokemon): [string, string] {
    const hpRatio = pokemon?.getHpRatio();
    if (!isNil(hpRatio)) {
      return ["healthRatio", Math.floor(hpRatio * 100).toString() + "%"];
    }
    return ["healthRatio", ""];
  }
}

export class WeightRequirement extends EncounterPokemonRequirement {
  requiredWeightRange: [number, number];

  constructor(requiredWeightRange: [number, number], minNumberOfPokemon: number = 1, invertQuery: boolean = false) {
    super();
    this.minNumberOfPokemon = minNumberOfPokemon;
    this.invertQuery = invertQuery;
    this.requiredWeightRange = requiredWeightRange;
  }

  override meetsRequirement(): boolean {
    // Party Pokemon's weight inside required weight range
    if (!isNil(this.requiredWeightRange) && this.requiredWeightRange[0] <= this.requiredWeightRange[1]) {
      const partyPokemon = globalScene.getPlayerParty();
      const pokemonInRange = this.queryParty(partyPokemon);
      if (pokemonInRange.length < this.minNumberOfPokemon) {
        return false;
      }
    }
    return true;
  }

  override queryParty(partyPokemon: PlayerPokemon[]): PlayerPokemon[] {
    if (!this.invertQuery) {
      return partyPokemon.filter(
        (pokemon) =>
          pokemon.getWeight() >= this.requiredWeightRange[0] && pokemon.getWeight() <= this.requiredWeightRange[1],
      );
    }
    // for an inverted query, we only want to get the pokemon that don't have ANY of the listed requiredWeightRanges
    return partyPokemon.filter(
      (pokemon) =>
        pokemon.getWeight() < this.requiredWeightRange[0] || pokemon.getWeight() > this.requiredWeightRange[1],
    );
  }

  override getDialogueToken(pokemon?: PlayerPokemon): [string, string] {
    return ["weight", pokemon?.getWeight().toString() ?? ""];
  }
}
