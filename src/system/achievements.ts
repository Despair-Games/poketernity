import i18next from "i18next";
import { PlayerGender } from "#enums/player-gender";
import type { Challenge } from "#app/data/challenge";
import type { ConditionFn } from "#app/@types/common";
import { Challenges } from "#enums/challenges";
import { globalScene } from "#app/global-scene";
import { settings } from "#app/system/settings/settings-manager";
import { ElementalType } from "#enums/elemental-type";
import { AchvCategory } from "#enums/achv-category";
import { pokemonEvolutions } from "#app/data/pokemon-evolutions/init-pokemon-evolutions";

// Note: Refer to https://github.com/Despair-Games/poketernity/pull/775/files for removed achv code
export class Achievement {
  protected _category: AchvCategory;
  protected readonly localizationKey: string;
  protected descriptionKey: string;
  protected descriptionLocArgs: Record<string, unknown>;
  protected readonly _iconImage: string;
  public readonly id: string;

  public secret: boolean;
  public hasParent: boolean;
  public readonly parentId: string;

  private conditionFunc?: ConditionFn;

  constructor(localizationKey: string, iconImage: string, conditionFunc?: ConditionFn) {
    this._category = AchvCategory.UNSPECIFIED;
    this.localizationKey = localizationKey;
    this.descriptionKey = localizationKey;
    this._iconImage = iconImage;
    this.conditionFunc = conditionFunc;
  }

  get flag(): AchvCategory {
    return this._category;
  }

  /**
   * Get the name of the achievement based on the gender of the player
   * @returns the name of the achievement localized for the player gender
   */
  public get name(): string {
    const playerGender = settings.display.playerGender ?? PlayerGender.MALE;
    const genderStr = PlayerGender[playerGender].toLowerCase();
    // Localization key is used to get the name of the achievement
    return i18next.t(`achv:${this.localizationKey}.name`, { context: genderStr });
  }

  /**
   * Get the description of the achievement based on the gender of the player
   * @returns the description of the achievement localized for the player gender
   */
  public get description(): string {
    const playerGender = settings.display.playerGender ?? PlayerGender.MALE;
    const genderStr = PlayerGender[playerGender].toLowerCase();
    const locOptions = { context: genderStr, ...(this.descriptionLocArgs ?? {}) };
    return i18next.t(`achv:${this.descriptionKey}.description`, locOptions);
  }

  public get iconImage(): string {
    return this._iconImage;
  }

  public setSecret(hasParent: boolean = false): this {
    this.secret = true;
    this.hasParent = hasParent;
    return this;
  }

  public validate(...args: unknown[]): boolean {
    return !this.conditionFunc || this.conditionFunc(...args);
  }
}

export class RibbonAchv extends Achievement {
  public readonly ribbonAmount: number;

  constructor(localizationKey: string, ribbonAmount: number, iconImage: string) {
    super(localizationKey, iconImage, () => globalScene.gameData.gameStats.ribbonsOwned >= this.ribbonAmount);
    this.ribbonAmount = ribbonAmount;
    this.descriptionKey = "RibbonAchv";
    this.descriptionLocArgs = { ribbonAmount: ribbonAmount.toLocaleString(i18next.resolvedLanguage ?? "en-US") };
  }
}

export class ChallengeAchv extends Achievement {
  constructor(localizationKey: string, iconImage: string, challengeFunc: (challenge: Challenge) => boolean) {
    super(localizationKey, iconImage, (challenge: Challenge) => challengeFunc(challenge));
    this._category = AchvCategory.CHALLENGE;
  }
}

export class MonoGenAchv extends ChallengeAchv {
  constructor(localizationKey: string, gen: number, iconImage: string) {
    super(
      localizationKey,
      iconImage,
      (c) =>
        c.isSingleGenerationChallenge()
        && c.value === gen
        && !globalScene.gameMode.challenges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0),
    );
  }
}

export class MonoTypeAchv extends ChallengeAchv {
  constructor(type: ElementalType, iconImage: string) {
    super(
      "MONO_" + ElementalType[type],
      iconImage,
      (c) =>
        c.isSingleTypeChallenge()
        && c.value === type + 1
        && !globalScene.gameMode.challenges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0),
    );
    this.descriptionKey = "MonoType";
    this.descriptionLocArgs = { type: i18next.t(`pokemonInfo:Type.${ElementalType[type]}`) };
  }
}

export const achvs = {
  _10_RIBBONS: new RibbonAchv("10_RIBBONS", 10, "bronze_ribbon"),
  _25_RIBBONS: new RibbonAchv("25_RIBBONS", 25, "great_ribbon").setSecret(true),
  _50_RIBBONS: new RibbonAchv("50_RIBBONS", 50, "ultra_ribbon").setSecret(true),
  _75_RIBBONS: new RibbonAchv("75_RIBBONS", 75, "epic_ribbon").setSecret(true),
  _100_RIBBONS: new RibbonAchv("100_RIBBONS", 100, "master_ribbon").setSecret(true),
  MAX_FRIENDSHIP: new Achievement("MAX_FRIENDSHIP", "soothe_bell"),
  MEGA_EVOLVE: new Achievement("MEGA_EVOLVE", "mega_bracelet"),
  GIGANTAMAX: new Achievement("GIGANTAMAX", "dynamax_band"),
  TERASTALLIZE: new Achievement("TERASTALLIZE", "tera_orb"),
  STELLAR_TERASTALLIZE: new Achievement("STELLAR_TERASTALLIZE", "stellar_tera_shard").setSecret(true),
  CATCH_MYTHICAL: new Achievement("CATCH_MYTHICAL", "strange_ball").setSecret(),
  CATCH_SUB_LEGENDARY: new Achievement("CATCH_SUB_LEGENDARY", "rb").setSecret(),
  CATCH_LEGENDARY: new Achievement("CATCH_LEGENDARY", "mb").setSecret(),
  SEE_SHINY: new Achievement("SEE_SHINY", "pb_gold"),
  SHINY_PARTY: new Achievement("SHINY_PARTY", "shiny_charm").setSecret(),
  HIDDEN_ABILITY: new Achievement("HIDDEN_ABILITY", "ability_charm"),
  PERFECT_IVS: new Achievement("PERFECT_IVS", "blunder_policy"),
  CLASSIC_VICTORY: new Achievement("CLASSIC_VICTORY", "relic_crown"),
  UNEVOLVED_CLASSIC_VICTORY: new Achievement("UNEVOLVED_CLASSIC_VICTORY", "eviolite", () =>
    globalScene.getPlayerParty().some((p) => p.getSpeciesForm(true).speciesId in pokemonEvolutions),
  ),
  MONO_GEN_ONE_VICTORY: new MonoGenAchv("MONO_GEN_ONE", 1, "ribbon_gen1"),
  MONO_GEN_TWO_VICTORY: new MonoGenAchv("MONO_GEN_TWO", 2, "ribbon_gen2"),
  MONO_GEN_THREE_VICTORY: new MonoGenAchv("MONO_GEN_THREE", 3, "ribbon_gen3"),
  MONO_GEN_FOUR_VICTORY: new MonoGenAchv("MONO_GEN_FOUR", 4, "ribbon_gen4"),
  MONO_GEN_FIVE_VICTORY: new MonoGenAchv("MONO_GEN_FIVE", 5, "ribbon_gen5"),
  MONO_GEN_SIX_VICTORY: new MonoGenAchv("MONO_GEN_SIX", 6, "ribbon_gen6"),
  MONO_GEN_SEVEN_VICTORY: new MonoGenAchv("MONO_GEN_SEVEN", 7, "ribbon_gen7"),
  MONO_GEN_EIGHT_VICTORY: new MonoGenAchv("MONO_GEN_EIGHT", 8, "ribbon_gen8"),
  MONO_GEN_NINE_VICTORY: new MonoGenAchv("MONO_GEN_NINE", 9, "ribbon_gen9"),
  MONO_NORMAL: new MonoTypeAchv(ElementalType.NORMAL, "silk_scarf"),
  MONO_FIGHTING: new MonoTypeAchv(ElementalType.FIGHTING, "black_belt"),
  MONO_FLYING: new MonoTypeAchv(ElementalType.FLYING, "sharp_beak"),
  MONO_POISON: new MonoTypeAchv(ElementalType.POISON, "poison_barb"),
  MONO_GROUND: new MonoTypeAchv(ElementalType.GROUND, "soft_sand"),
  MONO_ROCK: new MonoTypeAchv(ElementalType.ROCK, "hard_stone"),
  MONO_BUG: new MonoTypeAchv(ElementalType.BUG, "silver_powder"),
  MONO_GHOST: new MonoTypeAchv(ElementalType.GHOST, "spell_tag"),
  MONO_STEEL: new MonoTypeAchv(ElementalType.STEEL, "metal_coat"),
  MONO_FIRE: new MonoTypeAchv(ElementalType.FIRE, "charcoal"),
  MONO_WATER: new MonoTypeAchv(ElementalType.WATER, "mystic_water"),
  MONO_GRASS: new MonoTypeAchv(ElementalType.GRASS, "miracle_seed"),
  MONO_ELECTRIC: new MonoTypeAchv(ElementalType.ELECTRIC, "magnet"),
  MONO_PSYCHIC: new MonoTypeAchv(ElementalType.PSYCHIC, "twisted_spoon"),
  MONO_ICE: new MonoTypeAchv(ElementalType.ICE, "never_melt_ice"),
  MONO_DRAGON: new MonoTypeAchv(ElementalType.DRAGON, "dragon_fang"),
  MONO_DARK: new MonoTypeAchv(ElementalType.DARK, "black_glasses"),
  MONO_FAIRY: new MonoTypeAchv(ElementalType.FAIRY, "fairy_feather"),
  FRESH_START: new ChallengeAchv(
    "FRESH_START",
    "reviver_seed",
    (c) =>
      c.isFreshStartChallenge()
      && c.value > 0
      && !globalScene.gameMode.challenges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0),
  ),
  INVERSE_BATTLE: new ChallengeAchv("INVERSE_BATTLE", "inverse", (c) => c.isInverseBattleChallenge() && c.value > 0),
};

export function initAchievements() {
  const achvKeys = Object.keys(achvs);
  achvKeys.forEach((a: string, i: number) => {
    achvs[a].id = a;
    if (achvs[a].hasParent) {
      achvs[a].parentId = achvKeys[i - 1];
    }
  });
}
