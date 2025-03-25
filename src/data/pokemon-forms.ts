// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { FORM_CHANGE_MOVE } from "#app/data/balance/pokemon-level-moves";
import type { FormChangePhase } from "#app/phases/form-change-phase";
import type { QuietFormChangePhase } from "#app/phases/quiet-form-change-phase";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

import type { Pokemon } from "../field/pokemon";
import { allMoves } from "#app/data/data-lists";
import { MoveCategory } from "#enums/move-category";
import { ElementalType } from "#enums/elemental-type";
import type { AbstractConstructor, nil } from "#app/utils";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import { WeatherType } from "#enums/weather-type";
import { SpeciesFormKey } from "#enums/species-form-key";
import { globalScene } from "#app/global-scene";
import { FormChangeItem } from "#enums/form-change-item";
import { SpeciesFormChangeTrigger } from "#app/data/species-form-change-triggers/species-form-change-trigger";
import { SpeciesFormChangeManualTrigger } from "#app/data/species-form-change-triggers/species-form-change-manual-trigger";
import { SpeciesFormChangeCompoundTrigger } from "#app/data/species-form-change-triggers/species-form-change-compound-trigger";
import { SpeciesFormChangeItemTrigger } from "#app/data/species-form-change-triggers/species-form-change-item-trigger";
import { SpeciesFormChangeActiveTrigger } from "#app/data/species-form-change-triggers/species-form-change-active-trigger";
import { SpeciesFormChangeMoveLearnedTrigger } from "#app/data/species-form-change-triggers/species-form-change-move-learned-trigger";
import { SpeciesFormChangePreMoveTrigger } from "#app/data/species-form-change-triggers/species-form-change-pre-move-trigger";
import { MeloettaFormChangePostMoveTrigger } from "#app/data/species-form-change-triggers/meloetta-form-change-post-move-trigger";

export type SpeciesFormChangeConditionPredicate = (p: Pokemon) => boolean;
export type SpeciesFormChangeConditionEnforceFunc = (p: Pokemon) => void;

export class SpeciesFormChange {
  /**
   * The ID of the species that this form change applies to.
   */
  public speciesId: SpeciesId;

  /**
   * The form key that the Pokemon must have before applying this form change.
   */
  public preFormKey: string;

  /**
   * The form key that the Pokemon will have after applying this form change.
   */
  public formKey: string;

  /**
   * The trigger for when to apply this form change.
   */
  public trigger: SpeciesFormChangeTrigger;

  /**
   * If `false`, and if the Pokemon belongs to the player, play a cutscene using {@linkcode FormChangePhase}.
   * Otherwise, transform the Pokemon in place using {@linkcode QuietFormChangePhase}.
   */
  public quiet: boolean;

  /**
   * A list of moves that the Pokemon learns upon form change if its level is high enough.
   * If the indicated level is {@linkcode FORM_CHANGE_MOVE}, the move can be learned at any level.
   */
  public readonly movesToLearn: MoveId[];

  /**
   * A list of extra conditions that the Pokemon must satisfy before applying this form change.
   */
  public readonly conditions: SpeciesFormChangeCondition[];

  constructor(
    speciesId: SpeciesId,
    preFormKey: string,
    evoFormKey: string,
    trigger: SpeciesFormChangeTrigger,
    quiet: boolean = false,
    movesToLearn: MoveId[] = [],
    ...conditions: SpeciesFormChangeCondition[]
  ) {
    this.speciesId = speciesId;
    this.preFormKey = preFormKey;
    this.formKey = evoFormKey;
    this.trigger = trigger;
    this.quiet = quiet;
    this.movesToLearn = movesToLearn;
    this.conditions = conditions;
  }

  canChange(pokemon: Pokemon): boolean {
    if (pokemon.species.speciesId !== this.speciesId) {
      return false;
    }

    if (!pokemon.species.forms.length) {
      return false;
    }

    const formKeys = pokemon.species.forms.map((f) => f.formKey);
    if (formKeys[pokemon.formIndex] !== this.preFormKey) {
      return false;
    }

    if (formKeys[pokemon.formIndex] === this.formKey) {
      return false;
    }

    for (const condition of this.conditions) {
      if (!condition.predicate(pokemon)) {
        return false;
      }
    }

    if (!this.trigger.canChange(pokemon)) {
      return false;
    }

    return true;
  }

  findTrigger(triggerType: AbstractConstructor<SpeciesFormChangeTrigger>): SpeciesFormChangeTrigger | nil {
    if (!this.trigger.hasTriggerType(triggerType)) {
      return null;
    }

    const trigger = this.trigger;

    if (trigger instanceof SpeciesFormChangeCompoundTrigger) {
      return trigger.triggers.find((t) => t.hasTriggerType(triggerType));
    }

    return trigger;
  }
}

export class SpeciesFormChangeCondition {
  public predicate: SpeciesFormChangeConditionPredicate;
  public enforceFunc: SpeciesFormChangeConditionEnforceFunc | nil;

  constructor(predicate: SpeciesFormChangeConditionPredicate, enforceFunc?: SpeciesFormChangeConditionEnforceFunc) {
    this.predicate = predicate;
    this.enforceFunc = enforceFunc;
  }
}

export class SpeciesDefaultFormMatchTrigger extends SpeciesFormChangeTrigger {
  private formKey: string;

  constructor(formKey: string) {
    super();
    this.formKey = formKey;
  }

  override canChange(pokemon: Pokemon): boolean {
    return (
      this.formKey
      === pokemon.species.forms[
        globalScene.getSpeciesFormIndex(pokemon.species, pokemon.gender, pokemon.getNature(), true)
      ].formKey
    );
  }
}

/**
 * Class used for triggering form changes based on the user's Tera type.
 * Used by Ogerpon and Terapagos.
 * @extends SpeciesFormChangeTrigger
 */
export class SpeciesFormChangeTeraTrigger extends SpeciesFormChangeTrigger {
  /** The Tera type that triggers the form change */
  private teraType: ElementalType;

  constructor(teraType: ElementalType) {
    super();
    this.teraType = teraType;
  }

  /**
   * Checks if the associated Pokémon has the required Tera Shard that matches with the associated Tera type.
   * @param pokemon the Pokémon that is trying to do the form change
   * @returns `true` if the Pokémon can change forms, `false` otherwise
   */
  override canChange(pokemon: Pokemon): boolean {
    return !!globalScene.findModifier(
      (m) => m.isTerastallizeModifier() && m.pokemonId === pokemon.id && m.teraType === this.teraType,
    );
  }
}

/**
 * Class used for triggering form changes based on the user's lapsed Tera type.
 * Used by Ogerpon and Terapagos.
 * @extends SpeciesFormChangeTrigger
 */
export class SpeciesFormChangeLapseTeraTrigger extends SpeciesFormChangeTrigger {
  override canChange(pokemon: Pokemon): boolean {
    return !!globalScene.findModifier((m) => m.isTerastallizeModifier() && m.pokemonId === pokemon.id);
  }
}

/**
 * Class used for triggering form changes based on weather.
 * Used by Castform and Cherrim.
 * @extends SpeciesFormChangeTrigger
 */
export class SpeciesFormChangeWeatherTrigger extends SpeciesFormChangeTrigger {
  /** The ability that  triggers the form change */
  public ability: AbilityId;
  /** The list of weathers that trigger the form change */
  public weathers: WeatherType[];

  constructor(ability: AbilityId, weathers: WeatherType[]) {
    super();
    this.ability = ability;
    this.weathers = weathers;
  }

  /**
   * Checks if the Pokemon has the required ability and is in the correct weather while
   * the weather or ability is also not suppressed.
   * @param pokemon the pokemon that is trying to do the form change
   * @returns `true` if the Pokemon can change forms, `false` otherwise
   */
  override canChange(pokemon: Pokemon): boolean {
    const isWeatherSuppressed = globalScene.arena.weather?.isEffectSuppressed();
    const isAbilitySuppressed = pokemon.summonData.abilitySuppressed;

    return (
      !isAbilitySuppressed
      && !isWeatherSuppressed
      && pokemon.hasAbility(this.ability)
      && globalScene.arena.hasWeather(this.weathers)
    );
  }
}

/**
 * Class used for reverting to the original form when the weather runs out
 * or when the user loses the ability/is suppressed.
 * Used by Castform and Cherrim.
 * @extends SpeciesFormChangeTrigger
 */
export class SpeciesFormChangeRevertWeatherFormTrigger extends SpeciesFormChangeTrigger {
  /** The ability that triggers the form change*/
  public ability: AbilityId;
  /** The list of weathers that will also trigger a form change to original form */
  public weathers: WeatherType[];

  constructor(ability: AbilityId, weathers: WeatherType[]) {
    super();
    this.ability = ability;
    this.weathers = weathers;
  }

  /**
   * Checks if the Pokemon has the required ability and the weather is one that will revert
   * the Pokemon to its original form or the weather or ability is suppressed
   * @param pokemon the pokemon that is trying to do the form change
   * @returns `true` if the Pokemon will revert to its original form, `false` otherwise
   */
  override canChange(pokemon: Pokemon): boolean {
    if (pokemon.hasAbility(this.ability, false, true)) {
      const isWeatherSuppressed = globalScene.arena.weather?.isEffectSuppressed();
      const isAbilitySuppressed = pokemon.summonData.abilitySuppressed;
      const summonDataAbility = pokemon.summonData.ability;
      const isAbilityChanged = summonDataAbility !== this.ability && summonDataAbility !== AbilityId.NONE;

      if (
        globalScene.arena.hasWeather(this.weathers)
        || isWeatherSuppressed
        || isAbilitySuppressed
        || isAbilityChanged
      ) {
        return true;
      }
    }
    return false;
  }
}

export function getSpeciesFormChangeMessage(pokemon: Pokemon, formChange: SpeciesFormChange, preName: string): string {
  const isMega = formChange.formKey.indexOf(SpeciesFormKey.MEGA) > -1;
  const isGmax = formChange.formKey.indexOf(SpeciesFormKey.GIGANTAMAX) > -1;
  const isEmax = formChange.formKey.indexOf(SpeciesFormKey.ETERNAMAX) > -1;
  const isRevert = !isMega && formChange.formKey === pokemon.species.forms[0].formKey;
  if (isMega) {
    return i18next.t("battlePokemonForm:megaChange", { preName, pokemonName: pokemon.name });
  }
  if (isGmax) {
    return i18next.t("battlePokemonForm:gigantamaxChange", { preName, pokemonName: pokemon.name });
  }
  if (isEmax) {
    return i18next.t("battlePokemonForm:eternamaxChange", { preName, pokemonName: pokemon.name });
  }
  if (isRevert) {
    return i18next.t("battlePokemonForm:revertChange", { pokemonName: getPokemonNameWithAffix(pokemon) });
  }
  if (pokemon.getAbility().id === AbilityId.DISGUISE) {
    return i18next.t("battlePokemonForm:disguiseChange");
  }
  return i18next.t("battlePokemonForm:formChange", { preName });
}

/**
 * Gives a condition for form changing checking if a species is registered as caught in the player's dex data.
 * Used for fusion forms such as Kyurem and Necrozma.
 * @param species {@linkcode SpeciesId}
 * @returns A {@linkcode SpeciesFormChangeCondition} checking if that species is registered as caught
 */
function getSpeciesDependentFormChangeCondition(species: SpeciesId): SpeciesFormChangeCondition {
  return new SpeciesFormChangeCondition((_p) => !!globalScene.gameData.dexData[species].caughtAttr);
}

interface PokemonFormChanges {
  [key: string]: SpeciesFormChange[];
}

export const pokemonFormChanges: PokemonFormChanges = {
  [SpeciesId.VENUSAUR]: [
    new SpeciesFormChange(
      SpeciesId.VENUSAUR,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.VENUSAURITE),
    ),
    new SpeciesFormChange(
      SpeciesId.VENUSAUR,
      "",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_VINE_LASH],
    ),
  ],
  [SpeciesId.BLASTOISE]: [
    new SpeciesFormChange(
      SpeciesId.BLASTOISE,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.BLASTOISINITE),
    ),
    new SpeciesFormChange(
      SpeciesId.BLASTOISE,
      "",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_CANNONADE],
    ),
  ],
  [SpeciesId.CHARIZARD]: [
    new SpeciesFormChange(
      SpeciesId.CHARIZARD,
      "",
      SpeciesFormKey.MEGA_X,
      new SpeciesFormChangeItemTrigger(FormChangeItem.CHARIZARDITE_X),
    ),
    new SpeciesFormChange(
      SpeciesId.CHARIZARD,
      "",
      SpeciesFormKey.MEGA_Y,
      new SpeciesFormChangeItemTrigger(FormChangeItem.CHARIZARDITE_Y),
    ),
    new SpeciesFormChange(
      SpeciesId.CHARIZARD,
      "",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_WILDFIRE],
    ),
  ],
  [SpeciesId.BUTTERFREE]: [
    new SpeciesFormChange(
      SpeciesId.BUTTERFREE,
      "",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_BEFUDDLE],
    ),
  ],
  [SpeciesId.BEEDRILL]: [
    new SpeciesFormChange(
      SpeciesId.BEEDRILL,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.BEEDRILLITE),
    ),
  ],
  [SpeciesId.PIDGEOT]: [
    new SpeciesFormChange(
      SpeciesId.PIDGEOT,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.PIDGEOTITE),
    ),
  ],
  [SpeciesId.PIKACHU]: [
    new SpeciesFormChange(
      SpeciesId.PIKACHU,
      "",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_VOLT_CRASH],
    ),
    new SpeciesFormChange(
      SpeciesId.PIKACHU,
      "partner",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_VOLT_CRASH],
    ),
  ],
  [SpeciesId.MEOWTH]: [
    new SpeciesFormChange(
      SpeciesId.MEOWTH,
      "",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_GOLD_RUSH],
    ),
  ],
  [SpeciesId.ALAKAZAM]: [
    new SpeciesFormChange(
      SpeciesId.ALAKAZAM,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.ALAKAZITE),
    ),
  ],
  [SpeciesId.MACHAMP]: [
    new SpeciesFormChange(
      SpeciesId.MACHAMP,
      "",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_CHI_STRIKE],
    ),
  ],
  [SpeciesId.SLOWBRO]: [
    new SpeciesFormChange(
      SpeciesId.SLOWBRO,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.SLOWBRONITE),
    ),
  ],
  [SpeciesId.GENGAR]: [
    new SpeciesFormChange(
      SpeciesId.GENGAR,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.GENGARITE),
    ),
    new SpeciesFormChange(
      SpeciesId.GENGAR,
      "",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_TERROR],
    ),
  ],
  [SpeciesId.KINGLER]: [
    new SpeciesFormChange(
      SpeciesId.KINGLER,
      "",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_FOAM_BURST],
    ),
  ],
  [SpeciesId.KANGASKHAN]: [
    new SpeciesFormChange(
      SpeciesId.KANGASKHAN,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.KANGASKHANITE),
    ),
  ],
  [SpeciesId.PINSIR]: [
    new SpeciesFormChange(
      SpeciesId.PINSIR,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.PINSIRITE),
    ),
  ],
  [SpeciesId.GYARADOS]: [
    new SpeciesFormChange(
      SpeciesId.GYARADOS,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.GYARADOSITE),
    ),
  ],
  [SpeciesId.LAPRAS]: [
    new SpeciesFormChange(
      SpeciesId.LAPRAS,
      "",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_RESONANCE],
    ),
  ],
  [SpeciesId.EEVEE]: [
    new SpeciesFormChange(
      SpeciesId.EEVEE,
      "",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_CUDDLE],
    ),
    new SpeciesFormChange(
      SpeciesId.EEVEE,
      "partner",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_CUDDLE],
    ),
  ],
  [SpeciesId.SNORLAX]: [
    new SpeciesFormChange(
      SpeciesId.SNORLAX,
      "",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_REPLENISH],
    ),
  ],
  [SpeciesId.AERODACTYL]: [
    new SpeciesFormChange(
      SpeciesId.AERODACTYL,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.AERODACTYLITE),
    ),
  ],
  [SpeciesId.MEWTWO]: [
    new SpeciesFormChange(
      SpeciesId.MEWTWO,
      "",
      SpeciesFormKey.MEGA_X,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MEWTWONITE_X),
    ),
    new SpeciesFormChange(
      SpeciesId.MEWTWO,
      "",
      SpeciesFormKey.MEGA_Y,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MEWTWONITE_Y),
    ),
  ],
  [SpeciesId.AMPHAROS]: [
    new SpeciesFormChange(
      SpeciesId.AMPHAROS,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.AMPHAROSITE),
    ),
  ],
  [SpeciesId.STEELIX]: [
    new SpeciesFormChange(
      SpeciesId.STEELIX,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.STEELIXITE),
    ),
  ],
  [SpeciesId.SCIZOR]: [
    new SpeciesFormChange(
      SpeciesId.SCIZOR,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.SCIZORITE),
    ),
  ],
  [SpeciesId.HERACROSS]: [
    new SpeciesFormChange(
      SpeciesId.HERACROSS,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.HERACRONITE),
    ),
  ],
  [SpeciesId.HOUNDOOM]: [
    new SpeciesFormChange(
      SpeciesId.HOUNDOOM,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.HOUNDOOMINITE),
    ),
  ],
  [SpeciesId.TYRANITAR]: [
    new SpeciesFormChange(
      SpeciesId.TYRANITAR,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.TYRANITARITE),
    ),
  ],
  [SpeciesId.SCEPTILE]: [
    new SpeciesFormChange(
      SpeciesId.SCEPTILE,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.SCEPTILITE),
    ),
  ],
  [SpeciesId.BLAZIKEN]: [
    new SpeciesFormChange(
      SpeciesId.BLAZIKEN,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.BLAZIKENITE),
    ),
  ],
  [SpeciesId.SWAMPERT]: [
    new SpeciesFormChange(
      SpeciesId.SWAMPERT,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.SWAMPERTITE),
    ),
  ],
  [SpeciesId.GARDEVOIR]: [
    new SpeciesFormChange(
      SpeciesId.GARDEVOIR,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.GARDEVOIRITE),
    ),
  ],
  [SpeciesId.SABLEYE]: [
    new SpeciesFormChange(
      SpeciesId.SABLEYE,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.SABLENITE),
    ),
  ],
  [SpeciesId.MAWILE]: [
    new SpeciesFormChange(
      SpeciesId.MAWILE,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAWILITE),
    ),
  ],
  [SpeciesId.AGGRON]: [
    new SpeciesFormChange(
      SpeciesId.AGGRON,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.AGGRONITE),
    ),
  ],
  [SpeciesId.MEDICHAM]: [
    new SpeciesFormChange(
      SpeciesId.MEDICHAM,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MEDICHAMITE),
    ),
  ],
  [SpeciesId.MANECTRIC]: [
    new SpeciesFormChange(
      SpeciesId.MANECTRIC,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MANECTITE),
    ),
  ],
  [SpeciesId.SHARPEDO]: [
    new SpeciesFormChange(
      SpeciesId.SHARPEDO,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.SHARPEDONITE),
    ),
  ],
  [SpeciesId.CAMERUPT]: [
    new SpeciesFormChange(
      SpeciesId.CAMERUPT,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.CAMERUPTITE),
    ),
  ],
  [SpeciesId.ALTARIA]: [
    new SpeciesFormChange(
      SpeciesId.ALTARIA,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.ALTARIANITE),
    ),
  ],
  [SpeciesId.CASTFORM]: [
    new SpeciesFormChange(
      SpeciesId.CASTFORM,
      "",
      "sunny",
      new SpeciesFormChangeWeatherTrigger(AbilityId.FORECAST, [WeatherType.SUNNY, WeatherType.HARSH_SUN]),
      true,
    ),
    new SpeciesFormChange(
      SpeciesId.CASTFORM,
      "rainy",
      "sunny",
      new SpeciesFormChangeWeatherTrigger(AbilityId.FORECAST, [WeatherType.SUNNY, WeatherType.HARSH_SUN]),
      true,
    ),
    new SpeciesFormChange(
      SpeciesId.CASTFORM,
      "snowy",
      "sunny",
      new SpeciesFormChangeWeatherTrigger(AbilityId.FORECAST, [WeatherType.SUNNY, WeatherType.HARSH_SUN]),
      true,
    ),
    new SpeciesFormChange(
      SpeciesId.CASTFORM,
      "",
      "rainy",
      new SpeciesFormChangeWeatherTrigger(AbilityId.FORECAST, [WeatherType.RAIN, WeatherType.HEAVY_RAIN]),
      true,
    ),
    new SpeciesFormChange(
      SpeciesId.CASTFORM,
      "sunny",
      "rainy",
      new SpeciesFormChangeWeatherTrigger(AbilityId.FORECAST, [WeatherType.RAIN, WeatherType.HEAVY_RAIN]),
      true,
    ),
    new SpeciesFormChange(
      SpeciesId.CASTFORM,
      "snowy",
      "rainy",
      new SpeciesFormChangeWeatherTrigger(AbilityId.FORECAST, [WeatherType.RAIN, WeatherType.HEAVY_RAIN]),
      true,
    ),
    new SpeciesFormChange(
      SpeciesId.CASTFORM,
      "",
      "snowy",
      new SpeciesFormChangeWeatherTrigger(AbilityId.FORECAST, [WeatherType.HAIL, WeatherType.SNOW]),
      true,
    ),
    new SpeciesFormChange(
      SpeciesId.CASTFORM,
      "sunny",
      "snowy",
      new SpeciesFormChangeWeatherTrigger(AbilityId.FORECAST, [WeatherType.HAIL, WeatherType.SNOW]),
      true,
    ),
    new SpeciesFormChange(
      SpeciesId.CASTFORM,
      "rainy",
      "snowy",
      new SpeciesFormChangeWeatherTrigger(AbilityId.FORECAST, [WeatherType.HAIL, WeatherType.SNOW]),
      true,
    ),
    new SpeciesFormChange(
      SpeciesId.CASTFORM,
      "sunny",
      "",
      new SpeciesFormChangeRevertWeatherFormTrigger(AbilityId.FORECAST, [
        WeatherType.NONE,
        WeatherType.SANDSTORM,
        WeatherType.STRONG_WINDS,
        WeatherType.FOG,
      ]),
      true,
    ),
    new SpeciesFormChange(
      SpeciesId.CASTFORM,
      "rainy",
      "",
      new SpeciesFormChangeRevertWeatherFormTrigger(AbilityId.FORECAST, [
        WeatherType.NONE,
        WeatherType.SANDSTORM,
        WeatherType.STRONG_WINDS,
        WeatherType.FOG,
      ]),
      true,
    ),
    new SpeciesFormChange(
      SpeciesId.CASTFORM,
      "snowy",
      "",
      new SpeciesFormChangeRevertWeatherFormTrigger(AbilityId.FORECAST, [
        WeatherType.NONE,
        WeatherType.SANDSTORM,
        WeatherType.STRONG_WINDS,
        WeatherType.FOG,
      ]),
      true,
    ),
    new SpeciesFormChange(SpeciesId.CASTFORM, "sunny", "", new SpeciesFormChangeActiveTrigger(), true),
    new SpeciesFormChange(SpeciesId.CASTFORM, "rainy", "", new SpeciesFormChangeActiveTrigger(), true),
    new SpeciesFormChange(SpeciesId.CASTFORM, "snowy", "", new SpeciesFormChangeActiveTrigger(), true),
  ],
  [SpeciesId.BANETTE]: [
    new SpeciesFormChange(
      SpeciesId.BANETTE,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.BANETTITE),
    ),
  ],
  [SpeciesId.ABSOL]: [
    new SpeciesFormChange(
      SpeciesId.ABSOL,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.ABSOLITE),
    ),
  ],
  [SpeciesId.GLALIE]: [
    new SpeciesFormChange(
      SpeciesId.GLALIE,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.GLALITITE),
    ),
  ],
  [SpeciesId.SALAMENCE]: [
    new SpeciesFormChange(
      SpeciesId.SALAMENCE,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.SALAMENCITE),
    ),
  ],
  [SpeciesId.METAGROSS]: [
    new SpeciesFormChange(
      SpeciesId.METAGROSS,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.METAGROSSITE),
    ),
  ],
  [SpeciesId.LATIAS]: [
    new SpeciesFormChange(
      SpeciesId.LATIAS,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.LATIASITE),
    ),
  ],
  [SpeciesId.LATIOS]: [
    new SpeciesFormChange(
      SpeciesId.LATIOS,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.LATIOSITE),
    ),
  ],
  [SpeciesId.KYOGRE]: [
    new SpeciesFormChange(
      SpeciesId.KYOGRE,
      "",
      SpeciesFormKey.PRIMAL,
      new SpeciesFormChangeItemTrigger(FormChangeItem.BLUE_ORB),
    ),
  ],
  [SpeciesId.GROUDON]: [
    new SpeciesFormChange(
      SpeciesId.GROUDON,
      "",
      SpeciesFormKey.PRIMAL,
      new SpeciesFormChangeItemTrigger(FormChangeItem.RED_ORB),
    ),
  ],
  [SpeciesId.RAYQUAZA]: [
    new SpeciesFormChange(
      SpeciesId.RAYQUAZA,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.RAYQUAZITE),
    ),
  ],
  [SpeciesId.DEOXYS]: [
    new SpeciesFormChange(
      SpeciesId.DEOXYS,
      "normal",
      "attack",
      new SpeciesFormChangeItemTrigger(FormChangeItem.SHARP_METEORITE),
    ),
    new SpeciesFormChange(
      SpeciesId.DEOXYS,
      "normal",
      "defense",
      new SpeciesFormChangeItemTrigger(FormChangeItem.HARD_METEORITE),
    ),
    new SpeciesFormChange(
      SpeciesId.DEOXYS,
      "normal",
      "speed",
      new SpeciesFormChangeItemTrigger(FormChangeItem.SMOOTH_METEORITE),
    ),
  ],
  [SpeciesId.CHERRIM]: [
    new SpeciesFormChange(
      SpeciesId.CHERRIM,
      "overcast",
      "sunshine",
      new SpeciesFormChangeWeatherTrigger(AbilityId.FLOWER_GIFT, [WeatherType.SUNNY, WeatherType.HARSH_SUN]),
      true,
    ),
    new SpeciesFormChange(
      SpeciesId.CHERRIM,
      "sunshine",
      "overcast",
      new SpeciesFormChangeRevertWeatherFormTrigger(AbilityId.FLOWER_GIFT, [
        WeatherType.NONE,
        WeatherType.SANDSTORM,
        WeatherType.STRONG_WINDS,
        WeatherType.FOG,
        WeatherType.HAIL,
        WeatherType.HEAVY_RAIN,
        WeatherType.SNOW,
        WeatherType.RAIN,
      ]),
      true,
    ),
    new SpeciesFormChange(SpeciesId.CHERRIM, "sunshine", "overcast", new SpeciesFormChangeActiveTrigger(), true),
  ],
  [SpeciesId.LOPUNNY]: [
    new SpeciesFormChange(
      SpeciesId.LOPUNNY,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.LOPUNNITE),
    ),
  ],
  [SpeciesId.GARCHOMP]: [
    new SpeciesFormChange(
      SpeciesId.GARCHOMP,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.GARCHOMPITE),
    ),
  ],
  [SpeciesId.LUCARIO]: [
    new SpeciesFormChange(
      SpeciesId.LUCARIO,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.LUCARIONITE),
    ),
  ],
  [SpeciesId.ABOMASNOW]: [
    new SpeciesFormChange(
      SpeciesId.ABOMASNOW,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.ABOMASITE),
    ),
  ],
  [SpeciesId.GALLADE]: [
    new SpeciesFormChange(
      SpeciesId.GALLADE,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.GALLADITE),
    ),
  ],
  [SpeciesId.AUDINO]: [
    new SpeciesFormChange(
      SpeciesId.AUDINO,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.AUDINITE),
    ),
  ],
  [SpeciesId.DIALGA]: [
    new SpeciesFormChange(
      SpeciesId.DIALGA,
      "",
      SpeciesFormKey.ORIGIN,
      new SpeciesFormChangeItemTrigger(FormChangeItem.ADAMANT_CRYSTAL),
    ),
  ],
  [SpeciesId.PALKIA]: [
    new SpeciesFormChange(
      SpeciesId.PALKIA,
      "",
      SpeciesFormKey.ORIGIN,
      new SpeciesFormChangeItemTrigger(FormChangeItem.LUSTROUS_GLOBE),
    ),
  ],
  [SpeciesId.GIRATINA]: [
    new SpeciesFormChange(
      SpeciesId.GIRATINA,
      "altered",
      SpeciesFormKey.ORIGIN,
      new SpeciesFormChangeItemTrigger(FormChangeItem.GRISEOUS_CORE),
    ),
  ],
  [SpeciesId.SHAYMIN]: [
    new SpeciesFormChange(SpeciesId.SHAYMIN, "land", "sky", new SpeciesFormChangeItemTrigger(FormChangeItem.GRACIDEA)),
  ],
  [SpeciesId.ARCEUS]: [
    new SpeciesFormChange(
      SpeciesId.ARCEUS,
      "normal",
      "fighting",
      new SpeciesFormChangeItemTrigger(FormChangeItem.FIST_PLATE),
    ),
    new SpeciesFormChange(
      SpeciesId.ARCEUS,
      "normal",
      "flying",
      new SpeciesFormChangeItemTrigger(FormChangeItem.SKY_PLATE),
    ),
    new SpeciesFormChange(
      SpeciesId.ARCEUS,
      "normal",
      "poison",
      new SpeciesFormChangeItemTrigger(FormChangeItem.TOXIC_PLATE),
    ),
    new SpeciesFormChange(
      SpeciesId.ARCEUS,
      "normal",
      "ground",
      new SpeciesFormChangeItemTrigger(FormChangeItem.EARTH_PLATE),
    ),
    new SpeciesFormChange(
      SpeciesId.ARCEUS,
      "normal",
      "rock",
      new SpeciesFormChangeItemTrigger(FormChangeItem.STONE_PLATE),
    ),
    new SpeciesFormChange(
      SpeciesId.ARCEUS,
      "normal",
      "bug",
      new SpeciesFormChangeItemTrigger(FormChangeItem.INSECT_PLATE),
    ),
    new SpeciesFormChange(
      SpeciesId.ARCEUS,
      "normal",
      "ghost",
      new SpeciesFormChangeItemTrigger(FormChangeItem.SPOOKY_PLATE),
    ),
    new SpeciesFormChange(
      SpeciesId.ARCEUS,
      "normal",
      "steel",
      new SpeciesFormChangeItemTrigger(FormChangeItem.IRON_PLATE),
    ),
    new SpeciesFormChange(
      SpeciesId.ARCEUS,
      "normal",
      "fire",
      new SpeciesFormChangeItemTrigger(FormChangeItem.FLAME_PLATE),
    ),
    new SpeciesFormChange(
      SpeciesId.ARCEUS,
      "normal",
      "water",
      new SpeciesFormChangeItemTrigger(FormChangeItem.SPLASH_PLATE),
    ),
    new SpeciesFormChange(
      SpeciesId.ARCEUS,
      "normal",
      "grass",
      new SpeciesFormChangeItemTrigger(FormChangeItem.MEADOW_PLATE),
    ),
    new SpeciesFormChange(
      SpeciesId.ARCEUS,
      "normal",
      "electric",
      new SpeciesFormChangeItemTrigger(FormChangeItem.ZAP_PLATE),
    ),
    new SpeciesFormChange(
      SpeciesId.ARCEUS,
      "normal",
      "psychic",
      new SpeciesFormChangeItemTrigger(FormChangeItem.MIND_PLATE),
    ),
    new SpeciesFormChange(
      SpeciesId.ARCEUS,
      "normal",
      "ice",
      new SpeciesFormChangeItemTrigger(FormChangeItem.ICICLE_PLATE),
    ),
    new SpeciesFormChange(
      SpeciesId.ARCEUS,
      "normal",
      "dragon",
      new SpeciesFormChangeItemTrigger(FormChangeItem.DRACO_PLATE),
    ),
    new SpeciesFormChange(
      SpeciesId.ARCEUS,
      "normal",
      "dark",
      new SpeciesFormChangeItemTrigger(FormChangeItem.DREAD_PLATE),
    ),
    new SpeciesFormChange(
      SpeciesId.ARCEUS,
      "normal",
      "fairy",
      new SpeciesFormChangeItemTrigger(FormChangeItem.PIXIE_PLATE),
    ),
  ],
  [SpeciesId.DARMANITAN]: [
    new SpeciesFormChange(SpeciesId.DARMANITAN, "", "zen", new SpeciesFormChangeManualTrigger(), true),
    new SpeciesFormChange(SpeciesId.DARMANITAN, "zen", "", new SpeciesFormChangeManualTrigger(), true),
  ],
  [SpeciesId.GARBODOR]: [
    new SpeciesFormChange(
      SpeciesId.GARBODOR,
      "",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_MALODOR],
    ),
  ],
  [SpeciesId.TORNADUS]: [
    new SpeciesFormChange(
      SpeciesId.TORNADUS,
      SpeciesFormKey.INCARNATE,
      SpeciesFormKey.THERIAN,
      new SpeciesFormChangeItemTrigger(FormChangeItem.REVEAL_GLASS),
    ),
  ],
  [SpeciesId.THUNDURUS]: [
    new SpeciesFormChange(
      SpeciesId.THUNDURUS,
      SpeciesFormKey.INCARNATE,
      SpeciesFormKey.THERIAN,
      new SpeciesFormChangeItemTrigger(FormChangeItem.REVEAL_GLASS),
    ),
  ],
  [SpeciesId.LANDORUS]: [
    new SpeciesFormChange(
      SpeciesId.LANDORUS,
      SpeciesFormKey.INCARNATE,
      SpeciesFormKey.THERIAN,
      new SpeciesFormChangeItemTrigger(FormChangeItem.REVEAL_GLASS),
    ),
  ],
  [SpeciesId.KYUREM]: [
    new SpeciesFormChange(
      SpeciesId.KYUREM,
      "",
      "black",
      new SpeciesFormChangeItemTrigger(FormChangeItem.DARK_STONE),
      false,
      [MoveId.FUSION_BOLT, MoveId.FREEZE_SHOCK],
      getSpeciesDependentFormChangeCondition(SpeciesId.ZEKROM),
    ),
    new SpeciesFormChange(
      SpeciesId.KYUREM,
      "",
      "white",
      new SpeciesFormChangeItemTrigger(FormChangeItem.LIGHT_STONE),
      false,
      [MoveId.FUSION_FLARE, MoveId.ICE_BURN],
      getSpeciesDependentFormChangeCondition(SpeciesId.RESHIRAM),
    ),
  ],
  [SpeciesId.KELDEO]: [
    new SpeciesFormChange(
      SpeciesId.KELDEO,
      "ordinary",
      "resolute",
      new SpeciesFormChangeMoveLearnedTrigger(MoveId.SECRET_SWORD),
    ),
    new SpeciesFormChange(
      SpeciesId.KELDEO,
      "resolute",
      "ordinary",
      new SpeciesFormChangeMoveLearnedTrigger(MoveId.SECRET_SWORD, false),
    ),
  ],
  [SpeciesId.MELOETTA]: [
    new SpeciesFormChange(
      SpeciesId.MELOETTA,
      "aria",
      "pirouette",
      new MeloettaFormChangePostMoveTrigger(MoveId.RELIC_SONG),
      true,
    ),
    new SpeciesFormChange(
      SpeciesId.MELOETTA,
      "pirouette",
      "aria",
      new MeloettaFormChangePostMoveTrigger(MoveId.RELIC_SONG),
      true,
    ),
  ],
  [SpeciesId.GENESECT]: [
    new SpeciesFormChange(
      SpeciesId.GENESECT,
      "",
      "shock",
      new SpeciesFormChangeItemTrigger(FormChangeItem.SHOCK_DRIVE),
    ),
    new SpeciesFormChange(SpeciesId.GENESECT, "", "burn", new SpeciesFormChangeItemTrigger(FormChangeItem.BURN_DRIVE)),
    new SpeciesFormChange(
      SpeciesId.GENESECT,
      "",
      "chill",
      new SpeciesFormChangeItemTrigger(FormChangeItem.CHILL_DRIVE),
    ),
    new SpeciesFormChange(
      SpeciesId.GENESECT,
      "",
      "douse",
      new SpeciesFormChangeItemTrigger(FormChangeItem.DOUSE_DRIVE),
    ),
  ],
  [SpeciesId.GRENINJA]: [
    new SpeciesFormChange(SpeciesId.GRENINJA, "battle-bond", "ash", new SpeciesFormChangeManualTrigger(), true),
    new SpeciesFormChange(SpeciesId.GRENINJA, "ash", "battle-bond", new SpeciesFormChangeManualTrigger(), true),
  ],
  [SpeciesId.PALAFIN]: [
    new SpeciesFormChange(SpeciesId.PALAFIN, "zero", "hero", new SpeciesFormChangeManualTrigger(), true),
    new SpeciesFormChange(SpeciesId.PALAFIN, "hero", "zero", new SpeciesFormChangeManualTrigger(), true),
  ],
  [SpeciesId.AEGISLASH]: [
    new SpeciesFormChange(
      SpeciesId.AEGISLASH,
      "blade",
      "shield",
      new SpeciesFormChangePreMoveTrigger(MoveId.KINGS_SHIELD),
      true,
      [],
      new SpeciesFormChangeCondition((p) => p.hasAbility(AbilityId.STANCE_CHANGE)),
    ),
    new SpeciesFormChange(
      SpeciesId.AEGISLASH,
      "shield",
      "blade",
      new SpeciesFormChangePreMoveTrigger((m) => allMoves.get(m).category !== MoveCategory.STATUS),
      true,
      [],
      new SpeciesFormChangeCondition((p) => p.hasAbility(AbilityId.STANCE_CHANGE)),
    ),
    new SpeciesFormChange(SpeciesId.AEGISLASH, "blade", "shield", new SpeciesFormChangeActiveTrigger(false), true),
  ],
  [SpeciesId.XERNEAS]: [
    new SpeciesFormChange(SpeciesId.XERNEAS, "neutral", "active", new SpeciesFormChangeActiveTrigger(true), true),
    new SpeciesFormChange(SpeciesId.XERNEAS, "active", "neutral", new SpeciesFormChangeActiveTrigger(false), true),
  ],
  [SpeciesId.ZYGARDE]: [
    new SpeciesFormChange(SpeciesId.ZYGARDE, "50-pc", "complete", new SpeciesFormChangeManualTrigger(), true),
    new SpeciesFormChange(SpeciesId.ZYGARDE, "complete", "50-pc", new SpeciesFormChangeManualTrigger(), true),
    new SpeciesFormChange(SpeciesId.ZYGARDE, "10-pc", "10-complete", new SpeciesFormChangeManualTrigger(), true),
    new SpeciesFormChange(SpeciesId.ZYGARDE, "10-complete", "10-pc", new SpeciesFormChangeManualTrigger(), true),
  ],
  [SpeciesId.DIANCIE]: [
    new SpeciesFormChange(
      SpeciesId.DIANCIE,
      "",
      SpeciesFormKey.MEGA,
      new SpeciesFormChangeItemTrigger(FormChangeItem.DIANCITE),
    ),
  ],
  [SpeciesId.HOOPA]: [
    new SpeciesFormChange(
      SpeciesId.HOOPA,
      "",
      "unbound",
      new SpeciesFormChangeItemTrigger(FormChangeItem.PRISON_BOTTLE),
      false,
      [MoveId.HYPERSPACE_FURY], // Custom: This form change does not automatically trigger learning this move in mainline
    ),
  ],
  [SpeciesId.WISHIWASHI]: [
    new SpeciesFormChange(SpeciesId.WISHIWASHI, "", "school", new SpeciesFormChangeManualTrigger(), true),
    new SpeciesFormChange(SpeciesId.WISHIWASHI, "school", "", new SpeciesFormChangeManualTrigger(), true),
  ],
  [SpeciesId.SILVALLY]: [
    new SpeciesFormChange(
      SpeciesId.SILVALLY,
      "normal",
      "fighting",
      new SpeciesFormChangeItemTrigger(FormChangeItem.FIGHTING_MEMORY),
    ),
    new SpeciesFormChange(
      SpeciesId.SILVALLY,
      "normal",
      "flying",
      new SpeciesFormChangeItemTrigger(FormChangeItem.FLYING_MEMORY),
    ),
    new SpeciesFormChange(
      SpeciesId.SILVALLY,
      "normal",
      "poison",
      new SpeciesFormChangeItemTrigger(FormChangeItem.POISON_MEMORY),
    ),
    new SpeciesFormChange(
      SpeciesId.SILVALLY,
      "normal",
      "ground",
      new SpeciesFormChangeItemTrigger(FormChangeItem.GROUND_MEMORY),
    ),
    new SpeciesFormChange(
      SpeciesId.SILVALLY,
      "normal",
      "rock",
      new SpeciesFormChangeItemTrigger(FormChangeItem.ROCK_MEMORY),
    ),
    new SpeciesFormChange(
      SpeciesId.SILVALLY,
      "normal",
      "bug",
      new SpeciesFormChangeItemTrigger(FormChangeItem.BUG_MEMORY),
    ),
    new SpeciesFormChange(
      SpeciesId.SILVALLY,
      "normal",
      "ghost",
      new SpeciesFormChangeItemTrigger(FormChangeItem.GHOST_MEMORY),
    ),
    new SpeciesFormChange(
      SpeciesId.SILVALLY,
      "normal",
      "steel",
      new SpeciesFormChangeItemTrigger(FormChangeItem.STEEL_MEMORY),
    ),
    new SpeciesFormChange(
      SpeciesId.SILVALLY,
      "normal",
      "fire",
      new SpeciesFormChangeItemTrigger(FormChangeItem.FIRE_MEMORY),
    ),
    new SpeciesFormChange(
      SpeciesId.SILVALLY,
      "normal",
      "water",
      new SpeciesFormChangeItemTrigger(FormChangeItem.WATER_MEMORY),
    ),
    new SpeciesFormChange(
      SpeciesId.SILVALLY,
      "normal",
      "grass",
      new SpeciesFormChangeItemTrigger(FormChangeItem.GRASS_MEMORY),
    ),
    new SpeciesFormChange(
      SpeciesId.SILVALLY,
      "normal",
      "electric",
      new SpeciesFormChangeItemTrigger(FormChangeItem.ELECTRIC_MEMORY),
    ),
    new SpeciesFormChange(
      SpeciesId.SILVALLY,
      "normal",
      "psychic",
      new SpeciesFormChangeItemTrigger(FormChangeItem.PSYCHIC_MEMORY),
    ),
    new SpeciesFormChange(
      SpeciesId.SILVALLY,
      "normal",
      "ice",
      new SpeciesFormChangeItemTrigger(FormChangeItem.ICE_MEMORY),
    ),
    new SpeciesFormChange(
      SpeciesId.SILVALLY,
      "normal",
      "dragon",
      new SpeciesFormChangeItemTrigger(FormChangeItem.DRAGON_MEMORY),
    ),
    new SpeciesFormChange(
      SpeciesId.SILVALLY,
      "normal",
      "dark",
      new SpeciesFormChangeItemTrigger(FormChangeItem.DARK_MEMORY),
    ),
    new SpeciesFormChange(
      SpeciesId.SILVALLY,
      "normal",
      "fairy",
      new SpeciesFormChangeItemTrigger(FormChangeItem.FAIRY_MEMORY),
    ),
  ],
  [SpeciesId.MINIOR]: [
    new SpeciesFormChange(SpeciesId.MINIOR, "red-meteor", "red", new SpeciesFormChangeManualTrigger(), true),
    new SpeciesFormChange(SpeciesId.MINIOR, "red", "red-meteor", new SpeciesFormChangeManualTrigger(), true),
    new SpeciesFormChange(SpeciesId.MINIOR, "orange-meteor", "orange", new SpeciesFormChangeManualTrigger(), true),
    new SpeciesFormChange(SpeciesId.MINIOR, "orange", "orange-meteor", new SpeciesFormChangeManualTrigger(), true),
    new SpeciesFormChange(SpeciesId.MINIOR, "yellow-meteor", "yellow", new SpeciesFormChangeManualTrigger(), true),
    new SpeciesFormChange(SpeciesId.MINIOR, "yellow", "yellow-meteor", new SpeciesFormChangeManualTrigger(), true),
    new SpeciesFormChange(SpeciesId.MINIOR, "green-meteor", "green", new SpeciesFormChangeManualTrigger(), true),
    new SpeciesFormChange(SpeciesId.MINIOR, "green", "green-meteor", new SpeciesFormChangeManualTrigger(), true),
    new SpeciesFormChange(SpeciesId.MINIOR, "blue-meteor", "blue", new SpeciesFormChangeManualTrigger(), true),
    new SpeciesFormChange(SpeciesId.MINIOR, "blue", "blue-meteor", new SpeciesFormChangeManualTrigger(), true),
    new SpeciesFormChange(SpeciesId.MINIOR, "indigo-meteor", "indigo", new SpeciesFormChangeManualTrigger(), true),
    new SpeciesFormChange(SpeciesId.MINIOR, "indigo", "indigo-meteor", new SpeciesFormChangeManualTrigger(), true),
    new SpeciesFormChange(SpeciesId.MINIOR, "violet-meteor", "violet", new SpeciesFormChangeManualTrigger(), true),
    new SpeciesFormChange(SpeciesId.MINIOR, "violet", "violet-meteor", new SpeciesFormChangeManualTrigger(), true),
  ],
  [SpeciesId.MIMIKYU]: [
    new SpeciesFormChange(SpeciesId.MIMIKYU, "disguised", "busted", new SpeciesFormChangeManualTrigger(), true),
    new SpeciesFormChange(SpeciesId.MIMIKYU, "busted", "disguised", new SpeciesFormChangeManualTrigger(), true),
  ],
  [SpeciesId.NECROZMA]: [
    new SpeciesFormChange(
      SpeciesId.NECROZMA,
      "",
      "dawn-wings",
      new SpeciesFormChangeItemTrigger(FormChangeItem.N_LUNARIZER),
      false,
      [MoveId.MOONGEIST_BEAM],
      getSpeciesDependentFormChangeCondition(SpeciesId.LUNALA),
    ),
    new SpeciesFormChange(
      SpeciesId.NECROZMA,
      "",
      "dusk-mane",
      new SpeciesFormChangeItemTrigger(FormChangeItem.N_SOLARIZER),
      false,
      [MoveId.SUNSTEEL_STRIKE],
      getSpeciesDependentFormChangeCondition(SpeciesId.SOLGALEO),
    ),
    new SpeciesFormChange(
      SpeciesId.NECROZMA,
      "dawn-wings",
      "ultra",
      new SpeciesFormChangeItemTrigger(FormChangeItem.ULTRANECROZIUM_Z),
      false,
      [MoveId.MOONGEIST_BEAM, MoveId.SUNSTEEL_STRIKE],
    ),
    new SpeciesFormChange(
      SpeciesId.NECROZMA,
      "dusk-mane",
      "ultra",
      new SpeciesFormChangeItemTrigger(FormChangeItem.ULTRANECROZIUM_Z),
      false,
      [MoveId.SUNSTEEL_STRIKE, MoveId.MOONGEIST_BEAM],
    ),
  ],
  [SpeciesId.MELMETAL]: [
    new SpeciesFormChange(
      SpeciesId.MELMETAL,
      "",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_MELTDOWN],
    ),
  ],
  [SpeciesId.RILLABOOM]: [
    new SpeciesFormChange(
      SpeciesId.RILLABOOM,
      "",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_DRUM_SOLO],
    ),
  ],
  [SpeciesId.CINDERACE]: [
    new SpeciesFormChange(
      SpeciesId.CINDERACE,
      "",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_FIREBALL],
    ),
  ],
  [SpeciesId.INTELEON]: [
    new SpeciesFormChange(
      SpeciesId.INTELEON,
      "",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_HYDROSNIPE],
    ),
  ],
  [SpeciesId.CORVIKNIGHT]: [
    new SpeciesFormChange(
      SpeciesId.CORVIKNIGHT,
      "",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_WIND_RAGE],
    ),
  ],
  [SpeciesId.ORBEETLE]: [
    new SpeciesFormChange(
      SpeciesId.ORBEETLE,
      "",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_GRAVITAS],
    ),
  ],
  [SpeciesId.DREDNAW]: [
    new SpeciesFormChange(
      SpeciesId.DREDNAW,
      "",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_STONESURGE],
    ),
  ],
  [SpeciesId.COALOSSAL]: [
    new SpeciesFormChange(
      SpeciesId.COALOSSAL,
      "",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_VOLCALITH],
    ),
  ],
  [SpeciesId.FLAPPLE]: [
    new SpeciesFormChange(
      SpeciesId.FLAPPLE,
      "",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_TARTNESS],
    ),
  ],
  [SpeciesId.APPLETUN]: [
    new SpeciesFormChange(
      SpeciesId.APPLETUN,
      "",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_SWEETNESS],
    ),
  ],
  [SpeciesId.SANDACONDA]: [
    new SpeciesFormChange(
      SpeciesId.SANDACONDA,
      "",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_SANDBLAST],
    ),
  ],
  [SpeciesId.CRAMORANT]: [
    new SpeciesFormChange(
      SpeciesId.CRAMORANT,
      "",
      "gulping",
      new SpeciesFormChangeManualTrigger(),
      true,
      [],
      new SpeciesFormChangeCondition((p) => p.getHpRatio() >= 0.5),
    ),
    new SpeciesFormChange(
      SpeciesId.CRAMORANT,
      "",
      "gorging",
      new SpeciesFormChangeManualTrigger(),
      true,
      [],
      new SpeciesFormChangeCondition((p) => p.getHpRatio() < 0.5),
    ),
    new SpeciesFormChange(SpeciesId.CRAMORANT, "gulping", "", new SpeciesFormChangeManualTrigger(), true),
    new SpeciesFormChange(SpeciesId.CRAMORANT, "gorging", "", new SpeciesFormChangeManualTrigger(), true),
    new SpeciesFormChange(SpeciesId.CRAMORANT, "gulping", "", new SpeciesFormChangeActiveTrigger(false), true),
    new SpeciesFormChange(SpeciesId.CRAMORANT, "gorging", "", new SpeciesFormChangeActiveTrigger(false), true),
  ],
  [SpeciesId.TOXTRICITY]: [
    new SpeciesFormChange(
      SpeciesId.TOXTRICITY,
      "amped",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_STUN_SHOCK],
    ),
    new SpeciesFormChange(
      SpeciesId.TOXTRICITY,
      "lowkey",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_STUN_SHOCK],
    ),
    new SpeciesFormChange(
      SpeciesId.TOXTRICITY,
      SpeciesFormKey.GIGANTAMAX,
      "amped",
      new SpeciesFormChangeCompoundTrigger(
        new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS, false),
        new SpeciesDefaultFormMatchTrigger("amped"),
      ),
    ),
    new SpeciesFormChange(
      SpeciesId.TOXTRICITY,
      SpeciesFormKey.GIGANTAMAX,
      "lowkey",
      new SpeciesFormChangeCompoundTrigger(
        new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS, false),
        new SpeciesDefaultFormMatchTrigger("lowkey"),
      ),
    ),
  ],
  [SpeciesId.CENTISKORCH]: [
    new SpeciesFormChange(
      SpeciesId.CENTISKORCH,
      "",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_CENTIFERNO],
    ),
  ],
  [SpeciesId.HATTERENE]: [
    new SpeciesFormChange(
      SpeciesId.HATTERENE,
      "",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_SMITE],
    ),
  ],
  [SpeciesId.GRIMMSNARL]: [
    new SpeciesFormChange(
      SpeciesId.GRIMMSNARL,
      "",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_SNOOZE],
    ),
  ],
  [SpeciesId.ALCREMIE]: [
    new SpeciesFormChange(
      SpeciesId.ALCREMIE,
      "vanilla-cream",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_FINALE],
    ),
    new SpeciesFormChange(
      SpeciesId.ALCREMIE,
      "ruby-cream",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_FINALE],
    ),
    new SpeciesFormChange(
      SpeciesId.ALCREMIE,
      "matcha-cream",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_FINALE],
    ),
    new SpeciesFormChange(
      SpeciesId.ALCREMIE,
      "mint-cream",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_FINALE],
    ),
    new SpeciesFormChange(
      SpeciesId.ALCREMIE,
      "lemon-cream",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_FINALE],
    ),
    new SpeciesFormChange(
      SpeciesId.ALCREMIE,
      "salted-cream",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_FINALE],
    ),
    new SpeciesFormChange(
      SpeciesId.ALCREMIE,
      "ruby-swirl",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_FINALE],
    ),
    new SpeciesFormChange(
      SpeciesId.ALCREMIE,
      "caramel-swirl",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_FINALE],
    ),
    new SpeciesFormChange(
      SpeciesId.ALCREMIE,
      "rainbow-swirl",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_FINALE],
    ),
  ],
  [SpeciesId.EISCUE]: [
    new SpeciesFormChange(SpeciesId.EISCUE, "", "no-ice", new SpeciesFormChangeManualTrigger(), true),
    new SpeciesFormChange(SpeciesId.EISCUE, "no-ice", "", new SpeciesFormChangeManualTrigger(), true),
  ],
  [SpeciesId.MORPEKO]: [
    new SpeciesFormChange(SpeciesId.MORPEKO, "full-belly", "hangry", new SpeciesFormChangeManualTrigger(), true),
    new SpeciesFormChange(SpeciesId.MORPEKO, "hangry", "full-belly", new SpeciesFormChangeManualTrigger(), true),
  ],
  [SpeciesId.COPPERAJAH]: [
    new SpeciesFormChange(
      SpeciesId.COPPERAJAH,
      "",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_STEELSURGE],
    ),
  ],
  [SpeciesId.DURALUDON]: [
    new SpeciesFormChange(
      SpeciesId.DURALUDON,
      "",
      SpeciesFormKey.GIGANTAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_DEPLETION],
    ),
  ],
  [SpeciesId.ZACIAN]: [
    new SpeciesFormChange(
      SpeciesId.ZACIAN,
      "hero-of-many-battles",
      "crowned",
      new SpeciesFormChangeItemTrigger(FormChangeItem.RUSTED_SWORD),
      false,
      [MoveId.BEHEMOTH_BLADE],
    ),
  ],
  [SpeciesId.ZAMAZENTA]: [
    new SpeciesFormChange(
      SpeciesId.ZAMAZENTA,
      "hero-of-many-battles",
      "crowned",
      new SpeciesFormChangeItemTrigger(FormChangeItem.RUSTED_SHIELD),
      false,
      [MoveId.BEHEMOTH_BASH],
    ),
  ],
  // Custom: E-max is not obtainable by the player in mainline
  [SpeciesId.ETERNATUS]: [
    new SpeciesFormChange(SpeciesId.ETERNATUS, "", SpeciesFormKey.ETERNAMAX, new SpeciesFormChangeManualTrigger()),
    new SpeciesFormChange(
      SpeciesId.ETERNATUS,
      "",
      SpeciesFormKey.ETERNAMAX,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.ETERNABEAM],
    ),
  ],
  [SpeciesId.URSHIFU]: [
    new SpeciesFormChange(
      SpeciesId.URSHIFU,
      "single-strike",
      SpeciesFormKey.GIGANTAMAX_SINGLE,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_ONE_BLOW],
    ),
    new SpeciesFormChange(
      SpeciesId.URSHIFU,
      "rapid-strike",
      SpeciesFormKey.GIGANTAMAX_RAPID,
      new SpeciesFormChangeItemTrigger(FormChangeItem.MAX_MUSHROOMS),
      false,
      [MoveId.G_MAX_RAPID_FLOW],
    ),
  ],
  [SpeciesId.CALYREX]: [
    new SpeciesFormChange(
      SpeciesId.CALYREX,
      "",
      "ice",
      new SpeciesFormChangeItemTrigger(FormChangeItem.ICY_REINS_OF_UNITY),
      false,
      [MoveId.GLACIAL_LANCE],
      getSpeciesDependentFormChangeCondition(SpeciesId.GLASTRIER),
    ),
    new SpeciesFormChange(
      SpeciesId.CALYREX,
      "",
      "shadow",
      new SpeciesFormChangeItemTrigger(FormChangeItem.SHADOW_REINS_OF_UNITY),
      false,
      [MoveId.ASTRAL_BARRAGE],
      getSpeciesDependentFormChangeCondition(SpeciesId.SPECTRIER),
    ),
  ],
  [SpeciesId.ENAMORUS]: [
    new SpeciesFormChange(
      SpeciesId.ENAMORUS,
      SpeciesFormKey.INCARNATE,
      SpeciesFormKey.THERIAN,
      new SpeciesFormChangeItemTrigger(FormChangeItem.REVEAL_GLASS),
    ),
  ],
  [SpeciesId.OGERPON]: [
    new SpeciesFormChange(
      SpeciesId.OGERPON,
      "teal-mask",
      "wellspring-mask",
      new SpeciesFormChangeItemTrigger(FormChangeItem.WELLSPRING_MASK),
    ),
    new SpeciesFormChange(
      SpeciesId.OGERPON,
      "teal-mask",
      "hearthflame-mask",
      new SpeciesFormChangeItemTrigger(FormChangeItem.HEARTHFLAME_MASK),
    ),
    new SpeciesFormChange(
      SpeciesId.OGERPON,
      "teal-mask",
      "cornerstone-mask",
      new SpeciesFormChangeItemTrigger(FormChangeItem.CORNERSTONE_MASK),
    ),
    new SpeciesFormChange(
      SpeciesId.OGERPON,
      "teal-mask",
      "teal-mask-tera",
      new SpeciesFormChangeTeraTrigger(ElementalType.GRASS),
    ),
    new SpeciesFormChange(
      SpeciesId.OGERPON,
      "teal-mask-tera",
      "teal-mask",
      new SpeciesFormChangeLapseTeraTrigger(),
      true,
      [],
      new SpeciesFormChangeCondition((p) => p.getTeraType() !== ElementalType.GRASS),
    ),
    new SpeciesFormChange(
      SpeciesId.OGERPON,
      "wellspring-mask",
      "wellspring-mask-tera",
      new SpeciesFormChangeTeraTrigger(ElementalType.WATER),
    ),
    new SpeciesFormChange(
      SpeciesId.OGERPON,
      "wellspring-mask-tera",
      "wellspring-mask",
      new SpeciesFormChangeLapseTeraTrigger(),
      true,
      [],
      new SpeciesFormChangeCondition((p) => p.getTeraType() !== ElementalType.WATER),
    ),
    new SpeciesFormChange(
      SpeciesId.OGERPON,
      "hearthflame-mask",
      "hearthflame-mask-tera",
      new SpeciesFormChangeTeraTrigger(ElementalType.FIRE),
    ),
    new SpeciesFormChange(
      SpeciesId.OGERPON,
      "hearthflame-mask-tera",
      "hearthflame-mask",
      new SpeciesFormChangeLapseTeraTrigger(),
      true,
      [],
      new SpeciesFormChangeCondition((p) => p.getTeraType() !== ElementalType.FIRE),
    ),
    new SpeciesFormChange(
      SpeciesId.OGERPON,
      "cornerstone-mask",
      "cornerstone-mask-tera",
      new SpeciesFormChangeTeraTrigger(ElementalType.ROCK),
    ),
    new SpeciesFormChange(
      SpeciesId.OGERPON,
      "cornerstone-mask-tera",
      "cornerstone-mask",
      new SpeciesFormChangeLapseTeraTrigger(),
      true,
      [],
      new SpeciesFormChangeCondition((p) => p.getTeraType() !== ElementalType.ROCK),
    ),
  ],
  [SpeciesId.TERAPAGOS]: [
    new SpeciesFormChange(SpeciesId.TERAPAGOS, "", "terastal", new SpeciesFormChangeManualTrigger(), true),
    new SpeciesFormChange(
      SpeciesId.TERAPAGOS,
      "terastal",
      "stellar",
      new SpeciesFormChangeTeraTrigger(ElementalType.STELLAR),
    ),
    new SpeciesFormChange(
      SpeciesId.TERAPAGOS,
      "stellar",
      "terastal",
      new SpeciesFormChangeLapseTeraTrigger(),
      true,
      [],
      new SpeciesFormChangeCondition((p) => p.getTeraType() !== ElementalType.STELLAR),
    ),
  ],
  [SpeciesId.GALAR_DARMANITAN]: [
    new SpeciesFormChange(SpeciesId.GALAR_DARMANITAN, "", "zen", new SpeciesFormChangeManualTrigger(), true),
    new SpeciesFormChange(SpeciesId.GALAR_DARMANITAN, "zen", "", new SpeciesFormChangeManualTrigger(), true),
  ],
};

export function initPokemonForms() {
  const formChangeKeys = Object.keys(pokemonFormChanges);
  formChangeKeys.forEach((pk) => {
    const formChanges = pokemonFormChanges[pk];
    const newFormChanges: SpeciesFormChange[] = [];
    for (const fc of formChanges) {
      const itemTrigger = fc.findTrigger(SpeciesFormChangeItemTrigger) as SpeciesFormChangeItemTrigger;
      if (itemTrigger && !formChanges.find((c) => fc.formKey === c.preFormKey && fc.preFormKey === c.formKey)) {
        newFormChanges.push(
          new SpeciesFormChange(
            fc.speciesId,
            fc.formKey,
            fc.preFormKey,
            new SpeciesFormChangeItemTrigger(itemTrigger.item, false),
          ),
        );
      }
    }
    formChanges.push(...newFormChanges);
  });
}
