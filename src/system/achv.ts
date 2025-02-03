import { type Modifier } from "#app/modifier/modifier";
import { pokemonEvolutions } from "#app/data/balance/pokemon-evolutions";
import i18next from "i18next";
import { NumberHolder } from "#app/utils";
import { PlayerGender } from "#enums/player-gender";
import type { Challenge } from "#app/data/challenge";
import type { ConditionFn } from "#app/@types/common";
import { Stat, getShortenedStatKey } from "#enums/stat";
import { Challenges } from "#enums/challenges";
import { globalScene } from "#app/global-scene";
import { settings } from "#app/system/settings/settings-manager";
import { AchvTier } from "#enums/achv-tier";
import { ElementalType } from "#enums/elemental-type";
import { AchvCategory } from "#enums/achv-category";

export class Achv {
  protected _category: AchvCategory;
  protected readonly localizationKey: string;
  protected descriptionKey: string;
  protected descriptionLocArgs: Record<string, unknown>;
  protected readonly _iconImage: string;
  public readonly score: number;
  public readonly id: string;

  public secret: boolean;
  public hasParent: boolean;
  public readonly parentId: string;

  private conditionFunc?: ConditionFn;

  constructor(localizationKey: string, iconImage: string, score: number, conditionFunc?: ConditionFn) {
    this._category = AchvCategory.UNSPECIFIED;
    this.localizationKey = localizationKey;
    this.descriptionKey = localizationKey;
    this._iconImage = iconImage;
    this.score = score;
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

  public getTier(): AchvTier {
    if (this.score >= 100) {
      return AchvTier.MASTER;
    }
    if (this.score >= 75) {
      return AchvTier.EPIC;
    }
    if (this.score >= 50) {
      return AchvTier.ULTRA;
    }
    if (this.score >= 25) {
      return AchvTier.GREAT;
    }
    return AchvTier.COMMON;
  }
}

export class MoneyAchv extends Achv {
  public readonly moneyAmount: number;

  constructor(localizationKey: string, moneyAmount: number, iconImage: string, score: number) {
    super(localizationKey, iconImage, score, () => globalScene.money >= this.moneyAmount);
    this._category = AchvCategory.MONEY;
    this.moneyAmount = moneyAmount;
    this.descriptionKey = "MoneyAchv";
    this.descriptionLocArgs = { moneyAmount: moneyAmount.toLocaleString(i18next.resolvedLanguage ?? "en-US") };
  }
}

export class RibbonAchv extends Achv {
  public readonly ribbonAmount: number;

  constructor(localizationKey: string, ribbonAmount: number, iconImage: string, score: number) {
    super(localizationKey, iconImage, score, () => globalScene.gameData.gameStats.ribbonsOwned >= this.ribbonAmount);
    this.ribbonAmount = ribbonAmount;
    this.descriptionKey = "RibbonAchv";
    this.descriptionLocArgs = { ribbonAmount: ribbonAmount.toLocaleString(i18next.resolvedLanguage ?? "en-US") };
  }
}

export class DamageAchv extends Achv {
  public readonly damageAmount: number;

  constructor(localizationKey: string, damageAmount: number, iconImage: string, score: number) {
    super(
      localizationKey,
      iconImage,
      score,
      (damage: number | NumberHolder) => (damage instanceof NumberHolder ? damage.value : damage) >= this.damageAmount,
    );
    this._category = AchvCategory.DAMAGE;
    this.damageAmount = damageAmount;
    this.descriptionKey = "DamageAchv";
    this.descriptionLocArgs = { damageAmount: damageAmount.toLocaleString(i18next.resolvedLanguage ?? "en-US") };
  }
}

export class HealAchv extends Achv {
  public readonly healAmount: number;

  constructor(localizationKey: string, healAmount: number, iconImage: string, score: number) {
    super(
      localizationKey,
      iconImage,
      score,
      (heal: number | NumberHolder) => (heal instanceof NumberHolder ? heal.value : heal) >= this.healAmount,
    );
    this._category = AchvCategory.HEAL;
    this.healAmount = healAmount;
    this.descriptionKey = "HealAchv";
    this.descriptionLocArgs = {
      healAmount: healAmount.toLocaleString(i18next.resolvedLanguage ?? "en-US"),
      HP: i18next.t(getShortenedStatKey(Stat.HP)),
    };
  }
}

export class LevelAchv extends Achv {
  public readonly level: number;

  constructor(localizationKey: string, level: number, iconImage: string, score: number) {
    super(
      localizationKey,
      iconImage,
      score,
      (level: number | NumberHolder) => (level instanceof NumberHolder ? level.value : level) >= this.level,
    );
    this._category = AchvCategory.LEVEL;
    this.level = level;
    this.descriptionKey = "LevelAchv";
    this.descriptionLocArgs = { level: level };
  }
}

export class ModifierAchv extends Achv {
  constructor(
    localizationKey: string,
    iconImage: string,
    score: number,
    modifierFunc: (modifier: Modifier) => boolean,
  ) {
    super(localizationKey, iconImage, score, (modifier: Modifier) => modifierFunc(modifier));
    this._category = AchvCategory.MODIFIER;
  }
}

export class ChallengeAchv extends Achv {
  constructor(
    localizationKey: string,
    iconImage: string,
    score: number,
    challengeFunc: (challenge: Challenge) => boolean,
  ) {
    super(localizationKey, iconImage, score, (challenge: Challenge) => challengeFunc(challenge));
    this._category = AchvCategory.CHALLENGE;
  }
}

export class MonoGenAchv extends ChallengeAchv {
  constructor(localizationKey: string, gen: number, iconImage: string, score: number) {
    super(
      localizationKey,
      iconImage,
      score,
      (c) =>
        c.isSingleGenerationChallenge()
        && c.value === gen
        && !globalScene.gameMode.challenges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0),
    );
  }
}

export class MonoTypeAchv extends ChallengeAchv {
  constructor(type: ElementalType, iconImage: string, score: number) {
    super(
      "MONO_" + ElementalType[type],
      iconImage,
      score,
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
  _10K_MONEY: new MoneyAchv("10K_MONEY", 10000, "nugget", 10),
  _100K_MONEY: new MoneyAchv("100K_MONEY", 100000, "big_nugget", 25).setSecret(true),
  _1M_MONEY: new MoneyAchv("1M_MONEY", 1000000, "relic_gold", 50).setSecret(true),
  _10M_MONEY: new MoneyAchv("10M_MONEY", 10000000, "coin_case", 100).setSecret(true),
  _250_DMG: new DamageAchv("250_DMG", 250, "lucky_punch", 10),
  _1000_DMG: new DamageAchv("1000_DMG", 1000, "lucky_punch_great", 25).setSecret(true),
  _2500_DMG: new DamageAchv("2500_DMG", 2500, "lucky_punch_ultra", 50).setSecret(true),
  _10000_DMG: new DamageAchv("10000_DMG", 10000, "lucky_punch_master", 100).setSecret(true),
  _250_HEAL: new HealAchv("250_HEAL", 250, "potion", 10),
  _1000_HEAL: new HealAchv("1000_HEAL", 1000, "super_potion", 25).setSecret(true),
  _2500_HEAL: new HealAchv("2500_HEAL", 2500, "hyper_potion", 50).setSecret(true),
  _10000_HEAL: new HealAchv("10000_HEAL", 10000, "max_potion", 100).setSecret(true),
  LV_100: new LevelAchv("LV_100", 100, "rare_candy", 25).setSecret(),
  LV_250: new LevelAchv("LV_250", 250, "rarer_candy", 50).setSecret(true),
  LV_1000: new LevelAchv("LV_1000", 1000, "candy_jar", 100).setSecret(true),
  _10_RIBBONS: new RibbonAchv("10_RIBBONS", 10, "bronze_ribbon", 10),
  _25_RIBBONS: new RibbonAchv("25_RIBBONS", 25, "great_ribbon", 25).setSecret(true),
  _50_RIBBONS: new RibbonAchv("50_RIBBONS", 50, "ultra_ribbon", 50).setSecret(true),
  _75_RIBBONS: new RibbonAchv("75_RIBBONS", 75, "epic_ribbon", 75).setSecret(true),
  _100_RIBBONS: new RibbonAchv("100_RIBBONS", 100, "master_ribbon", 100).setSecret(true),
  TRANSFER_MAX_STAT_STAGE: new Achv("TRANSFER_MAX_STAT_STAGE", "baton", 20),
  MAX_FRIENDSHIP: new Achv("MAX_FRIENDSHIP", "soothe_bell", 25),
  MEGA_EVOLVE: new Achv("MEGA_EVOLVE", "mega_bracelet", 50),
  GIGANTAMAX: new Achv("GIGANTAMAX", "dynamax_band", 50),
  TERASTALLIZE: new Achv("TERASTALLIZE", "tera_orb", 25),
  STELLAR_TERASTALLIZE: new Achv("STELLAR_TERASTALLIZE", "stellar_tera_shard", 25).setSecret(true),
  SPLICE: new Achv("SPLICE", "dna_splicers", 10),
  MINI_BLACK_HOLE: new ModifierAchv("MINI_BLACK_HOLE", "mini_black_hole", 25, (modifier) =>
    modifier.isTurnHeldItemTransferModifier(),
  ).setSecret(),
  CATCH_MYTHICAL: new Achv("CATCH_MYTHICAL", "strange_ball", 50).setSecret(),
  CATCH_SUB_LEGENDARY: new Achv("CATCH_SUB_LEGENDARY", "rb", 75).setSecret(),
  CATCH_LEGENDARY: new Achv("CATCH_LEGENDARY", "mb", 100).setSecret(),
  SEE_SHINY: new Achv("SEE_SHINY", "pb_gold", 75),
  SHINY_PARTY: new Achv("SHINY_PARTY", "shiny_charm", 100).setSecret(true),
  HATCH_MYTHICAL: new Achv("HATCH_MYTHICAL", "mystery_egg", 75).setSecret(),
  HATCH_SUB_LEGENDARY: new Achv("HATCH_SUB_LEGENDARY", "oval_stone", 100).setSecret(),
  HATCH_LEGENDARY: new Achv("HATCH_LEGENDARY", "lucky_egg", 125).setSecret(),
  HATCH_SHINY: new Achv("HATCH_SHINY", "golden_egg", 100).setSecret(),
  HIDDEN_ABILITY: new Achv("HIDDEN_ABILITY", "ability_charm", 75),
  PERFECT_IVS: new Achv("PERFECT_IVS", "blunder_policy", 100),
  CLASSIC_VICTORY: new Achv("CLASSIC_VICTORY", "relic_crown", 150),
  UNEVOLVED_CLASSIC_VICTORY: new Achv("UNEVOLVED_CLASSIC_VICTORY", "eviolite", 175, () =>
    globalScene.getPlayerParty().some((p) => p.getSpeciesForm(true).speciesId in pokemonEvolutions),
  ),
  MONO_GEN_ONE_VICTORY: new MonoGenAchv("MONO_GEN_ONE", 1, "ribbon_gen1", 100),
  MONO_GEN_TWO_VICTORY: new MonoGenAchv("MONO_GEN_TWO", 2, "ribbon_gen2", 100),
  MONO_GEN_THREE_VICTORY: new MonoGenAchv("MONO_GEN_THREE", 3, "ribbon_gen3", 100),
  MONO_GEN_FOUR_VICTORY: new MonoGenAchv("MONO_GEN_FOUR", 4, "ribbon_gen4", 100),
  MONO_GEN_FIVE_VICTORY: new MonoGenAchv("MONO_GEN_FIVE", 5, "ribbon_gen5", 100),
  MONO_GEN_SIX_VICTORY: new MonoGenAchv("MONO_GEN_SIX", 6, "ribbon_gen6", 100),
  MONO_GEN_SEVEN_VICTORY: new MonoGenAchv("MONO_GEN_SEVEN", 7, "ribbon_gen7", 100),
  MONO_GEN_EIGHT_VICTORY: new MonoGenAchv("MONO_GEN_EIGHT", 8, "ribbon_gen8", 100),
  MONO_GEN_NINE_VICTORY: new MonoGenAchv("MONO_GEN_NINE", 9, "ribbon_gen9", 100),
  MONO_NORMAL: new MonoTypeAchv(ElementalType.NORMAL, "silk_scarf", 100),
  MONO_FIGHTING: new MonoTypeAchv(ElementalType.FIGHTING, "black_belt", 100),
  MONO_FLYING: new MonoTypeAchv(ElementalType.FLYING, "sharp_beak", 100),
  MONO_POISON: new MonoTypeAchv(ElementalType.POISON, "poison_barb", 100),
  MONO_GROUND: new MonoTypeAchv(ElementalType.GROUND, "soft_sand", 100),
  MONO_ROCK: new MonoTypeAchv(ElementalType.ROCK, "hard_stone", 100),
  MONO_BUG: new MonoTypeAchv(ElementalType.BUG, "silver_powder", 100),
  MONO_GHOST: new MonoTypeAchv(ElementalType.GHOST, "spell_tag", 100),
  MONO_STEEL: new MonoTypeAchv(ElementalType.STEEL, "metal_coat", 100),
  MONO_FIRE: new MonoTypeAchv(ElementalType.FIRE, "charcoal", 100),
  MONO_WATER: new MonoTypeAchv(ElementalType.WATER, "mystic_water", 100),
  MONO_GRASS: new MonoTypeAchv(ElementalType.GRASS, "miracle_seed", 100),
  MONO_ELECTRIC: new MonoTypeAchv(ElementalType.ELECTRIC, "magnet", 100),
  MONO_PSYCHIC: new MonoTypeAchv(ElementalType.PSYCHIC, "twisted_spoon", 100),
  MONO_ICE: new MonoTypeAchv(ElementalType.ICE, "never_melt_ice", 100),
  MONO_DRAGON: new MonoTypeAchv(ElementalType.DRAGON, "dragon_fang", 100),
  MONO_DARK: new MonoTypeAchv(ElementalType.DARK, "black_glasses", 100),
  MONO_FAIRY: new MonoTypeAchv(ElementalType.FAIRY, "fairy_feather", 100),
  FRESH_START: new ChallengeAchv(
    "FRESH_START",
    "reviver_seed",
    100,
    (c) =>
      c.isFreshStartChallenge()
      && c.value > 0
      && !globalScene.gameMode.challenges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0),
  ),
  INVERSE_BATTLE: new ChallengeAchv(
    "INVERSE_BATTLE",
    "inverse",
    100,
    (c) => c.isInverseBattleChallenge() && c.value > 0,
  ),
  BREEDERS_IN_SPACE: new Achv("BREEDERS_IN_SPACE", "moon_stone", 50).setSecret(),
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
