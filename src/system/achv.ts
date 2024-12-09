import type { ConditionFn } from "#app/@types/common";
import type { Challenge } from "#app/data/challenge";
import { Stat, getShortenedStatKey } from "#app/enums/stat";
import { globalScene } from "#app/global-scene";
import { NumberHolder } from "#app/utils";
import { PlayerGender } from "#enums/player-gender";
import i18next from "i18next";
import type { Modifier } from "typescript";
import { achvs } from "./achvs";

export enum AchvTier {
  COMMON,
  GREAT,
  ULTRA,
  EPIC,
  MASTER,
}

export class Achv {
  public localizationKey: string;
  public id: string;
  public name: string;
  public description: string;
  public iconImage: string;
  public score: integer;

  public secret: boolean;
  public hasParent: boolean;
  public parentId: string;

  private conditionFunc: ConditionFn | undefined;

  constructor(
    localizationKey: string,
    name: string,
    description: string,
    iconImage: string,
    score: integer,
    conditionFunc?: ConditionFn,
  ) {
    this.name = name;
    this.description = description;
    this.iconImage = iconImage;
    this.score = score;
    this.conditionFunc = conditionFunc;
    this.localizationKey = localizationKey;
  }

  /**
   * Get the name of the achievement based on the gender of the player
   * @param playerGender - the gender of the player (default: {@linkcode PlayerGender.UNSET})
   * @returns the name of the achievement localized for the player gender
   */
  getName(playerGender: PlayerGender = PlayerGender.UNSET): string {
    const genderStr = PlayerGender[playerGender].toLowerCase();
    // Localization key is used to get the name of the achievement
    return i18next.t(`achv:${this.localizationKey}.name`, { context: genderStr });
  }

  getDescription(): string {
    return this.description;
  }

  getIconImage(): string {
    return this.iconImage;
  }

  setSecret(hasParent?: boolean): this {
    this.secret = true;
    this.hasParent = !!hasParent;
    return this;
  }

  validate(args?: any[]): boolean {
    return !this.conditionFunc || this.conditionFunc(args);
  }

  getTier(): AchvTier {
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
  moneyAmount: integer;

  constructor(localizationKey: string, name: string, moneyAmount: integer, iconImage: string, score: integer) {
    super(localizationKey, name, "", iconImage, score, (_args: any[]) => globalScene.money >= this.moneyAmount);
    this.moneyAmount = moneyAmount;
  }
}

export class RibbonAchv extends Achv {
  ribbonAmount: integer;

  constructor(localizationKey: string, name: string, ribbonAmount: integer, iconImage: string, score: integer) {
    super(
      localizationKey,
      name,
      "",
      iconImage,
      score,
      (_args: any[]) => globalScene.gameData.gameStats.ribbonsOwned >= this.ribbonAmount,
    );
    this.ribbonAmount = ribbonAmount;
  }
}

export class DamageAchv extends Achv {
  damageAmount: integer;

  constructor(localizationKey: string, name: string, damageAmount: integer, iconImage: string, score: integer) {
    super(
      localizationKey,
      name,
      "",
      iconImage,
      score,
      (args: any[]) => (args[0] instanceof NumberHolder ? args[0].value : args[0]) >= this.damageAmount,
    );
    this.damageAmount = damageAmount;
  }
}

export class HealAchv extends Achv {
  healAmount: integer;

  constructor(localizationKey: string, name: string, healAmount: integer, iconImage: string, score: integer) {
    super(
      localizationKey,
      name,
      "",
      iconImage,
      score,
      (args: any[]) => (args[0] instanceof NumberHolder ? args[0].value : args[0]) >= this.healAmount,
    );
    this.healAmount = healAmount;
  }
}

export class LevelAchv extends Achv {
  level: integer;

  constructor(localizationKey: string, name: string, level: integer, iconImage: string, score: integer) {
    super(
      localizationKey,
      name,
      "",
      iconImage,
      score,
      (args: any[]) => (args[0] instanceof NumberHolder ? args[0].value : args[0]) >= this.level,
    );
    this.level = level;
  }
}

export class ModifierAchv extends Achv {
  constructor(
    localizationKey: string,
    name: string,
    description: string,
    iconImage: string,
    score: integer,
    modifierFunc: (modifier: Modifier) => boolean,
  ) {
    super(localizationKey, name, description, iconImage, score, (args: any[]) => modifierFunc(args[0] as Modifier));
  }
}

export class ChallengeAchv extends Achv {
  constructor(
    localizationKey: string,
    name: string,
    description: string,
    iconImage: string,
    score: integer,
    challengeFunc: (challenge: Challenge) => boolean,
  ) {
    super(localizationKey, name, description, iconImage, score, (args: any[]) => challengeFunc(args[0] as Challenge));
  }
}

/**
 * Get the description of an achievement from the localization file with all the necessary variables filled in
 * @param localizationKey The localization key of the achievement
 * @returns The description of the achievement
 */
export function getAchievementDescription(localizationKey: string): string {
  // We need to get the player gender from the game data to add the correct prefix to the achievement name
  const genderIndex = this?.scene?.gameData?.gender ?? PlayerGender.MALE; //TODO: why is `this` being used here!? We are not inside a scope (copied from original)
  const genderStr = PlayerGender[genderIndex].toLowerCase();

  switch (localizationKey) {
    case "10K_MONEY":
      return i18next.t("achv:MoneyAchv.description", {
        context: genderStr,
        moneyAmount: achvs._10K_MONEY.moneyAmount.toLocaleString("en-US"),
      });
    case "100K_MONEY":
      return i18next.t("achv:MoneyAchv.description", {
        context: genderStr,
        moneyAmount: achvs._100K_MONEY.moneyAmount.toLocaleString("en-US"),
      });
    case "1M_MONEY":
      return i18next.t("achv:MoneyAchv.description", {
        context: genderStr,
        moneyAmount: achvs._1M_MONEY.moneyAmount.toLocaleString("en-US"),
      });
    case "10M_MONEY":
      return i18next.t("achv:MoneyAchv.description", {
        context: genderStr,
        moneyAmount: achvs._10M_MONEY.moneyAmount.toLocaleString("en-US"),
      });
    case "250_DMG":
      return i18next.t("achv:DamageAchv.description", {
        context: genderStr,
        damageAmount: achvs._250_DMG.damageAmount.toLocaleString("en-US"),
      });
    case "1000_DMG":
      return i18next.t("achv:DamageAchv.description", {
        context: genderStr,
        damageAmount: achvs._1000_DMG.damageAmount.toLocaleString("en-US"),
      });
    case "2500_DMG":
      return i18next.t("achv:DamageAchv.description", {
        context: genderStr,
        damageAmount: achvs._2500_DMG.damageAmount.toLocaleString("en-US"),
      });
    case "10000_DMG":
      return i18next.t("achv:DamageAchv.description", {
        context: genderStr,
        damageAmount: achvs._10000_DMG.damageAmount.toLocaleString("en-US"),
      });
    case "250_HEAL":
      return i18next.t("achv:HealAchv.description", {
        context: genderStr,
        healAmount: achvs._250_HEAL.healAmount.toLocaleString("en-US"),
        HP: i18next.t(getShortenedStatKey(Stat.HP)),
      });
    case "1000_HEAL":
      return i18next.t("achv:HealAchv.description", {
        context: genderStr,
        healAmount: achvs._1000_HEAL.healAmount.toLocaleString("en-US"),
        HP: i18next.t(getShortenedStatKey(Stat.HP)),
      });
    case "2500_HEAL":
      return i18next.t("achv:HealAchv.description", {
        context: genderStr,
        healAmount: achvs._2500_HEAL.healAmount.toLocaleString("en-US"),
        HP: i18next.t(getShortenedStatKey(Stat.HP)),
      });
    case "10000_HEAL":
      return i18next.t("achv:HealAchv.description", {
        context: genderStr,
        healAmount: achvs._10000_HEAL.healAmount.toLocaleString("en-US"),
        HP: i18next.t(getShortenedStatKey(Stat.HP)),
      });
    case "LV_100":
      return i18next.t("achv:LevelAchv.description", { context: genderStr, level: achvs.LV_100.level });
    case "LV_250":
      return i18next.t("achv:LevelAchv.description", { context: genderStr, level: achvs.LV_250.level });
    case "LV_1000":
      return i18next.t("achv:LevelAchv.description", { context: genderStr, level: achvs.LV_1000.level });
    case "10_RIBBONS":
      return i18next.t("achv:RibbonAchv.description", {
        context: genderStr,
        ribbonAmount: achvs._10_RIBBONS.ribbonAmount.toLocaleString("en-US"),
      });
    case "25_RIBBONS":
      return i18next.t("achv:RibbonAchv.description", {
        context: genderStr,
        ribbonAmount: achvs._25_RIBBONS.ribbonAmount.toLocaleString("en-US"),
      });
    case "50_RIBBONS":
      return i18next.t("achv:RibbonAchv.description", {
        context: genderStr,
        ribbonAmount: achvs._50_RIBBONS.ribbonAmount.toLocaleString("en-US"),
      });
    case "75_RIBBONS":
      return i18next.t("achv:RibbonAchv.description", {
        context: genderStr,
        ribbonAmount: achvs._75_RIBBONS.ribbonAmount.toLocaleString("en-US"),
      });
    case "100_RIBBONS":
      return i18next.t("achv:RibbonAchv.description", {
        context: genderStr,
        ribbonAmount: achvs._100_RIBBONS.ribbonAmount.toLocaleString("en-US"),
      });
    case "TRANSFER_MAX_STAT_STAGE":
      return i18next.t("achv:TRANSFER_MAX_STAT_STAGE.description", { context: genderStr });
    case "MAX_FRIENDSHIP":
      return i18next.t("achv:MAX_FRIENDSHIP.description", { context: genderStr });
    case "MEGA_EVOLVE":
      return i18next.t("achv:MEGA_EVOLVE.description", { context: genderStr });
    case "GIGANTAMAX":
      return i18next.t("achv:GIGANTAMAX.description", { context: genderStr });
    case "TERASTALLIZE":
      return i18next.t("achv:TERASTALLIZE.description", { context: genderStr });
    case "STELLAR_TERASTALLIZE":
      return i18next.t("achv:STELLAR_TERASTALLIZE.description", { context: genderStr });
    case "SPLICE":
      return i18next.t("achv:SPLICE.description", { context: genderStr });
    case "MINI_BLACK_HOLE":
      return i18next.t("achv:MINI_BLACK_HOLE.description", { context: genderStr });
    case "CATCH_MYTHICAL":
      return i18next.t("achv:CATCH_MYTHICAL.description", { context: genderStr });
    case "CATCH_SUB_LEGENDARY":
      return i18next.t("achv:CATCH_SUB_LEGENDARY.description", { context: genderStr });
    case "CATCH_LEGENDARY":
      return i18next.t("achv:CATCH_LEGENDARY.description", { context: genderStr });
    case "SEE_SHINY":
      return i18next.t("achv:SEE_SHINY.description", { context: genderStr });
    case "SHINY_PARTY":
      return i18next.t("achv:SHINY_PARTY.description", { context: genderStr });
    case "HATCH_MYTHICAL":
      return i18next.t("achv:HATCH_MYTHICAL.description", { context: genderStr });
    case "HATCH_SUB_LEGENDARY":
      return i18next.t("achv:HATCH_SUB_LEGENDARY.description", { context: genderStr });
    case "HATCH_LEGENDARY":
      return i18next.t("achv:HATCH_LEGENDARY.description", { context: genderStr });
    case "HATCH_SHINY":
      return i18next.t("achv:HATCH_SHINY.description", { context: genderStr });
    case "HIDDEN_ABILITY":
      return i18next.t("achv:HIDDEN_ABILITY.description", { context: genderStr });
    case "PERFECT_IVS":
      return i18next.t("achv:PERFECT_IVS.description", { context: genderStr });
    case "CLASSIC_VICTORY":
      return i18next.t("achv:CLASSIC_VICTORY.description", { context: genderStr });
    case "UNEVOLVED_CLASSIC_VICTORY":
      return i18next.t("achv:UNEVOLVED_CLASSIC_VICTORY.description", { context: genderStr });
    case "MONO_GEN_ONE":
      return i18next.t("achv:MONO_GEN_ONE.description", { context: genderStr });
    case "MONO_GEN_TWO":
      return i18next.t("achv:MONO_GEN_TWO.description", { context: genderStr });
    case "MONO_GEN_THREE":
      return i18next.t("achv:MONO_GEN_THREE.description", { context: genderStr });
    case "MONO_GEN_FOUR":
      return i18next.t("achv:MONO_GEN_FOUR.description", { context: genderStr });
    case "MONO_GEN_FIVE":
      return i18next.t("achv:MONO_GEN_FIVE.description", { context: genderStr });
    case "MONO_GEN_SIX":
      return i18next.t("achv:MONO_GEN_SIX.description", { context: genderStr });
    case "MONO_GEN_SEVEN":
      return i18next.t("achv:MONO_GEN_SEVEN.description", { context: genderStr });
    case "MONO_GEN_EIGHT":
      return i18next.t("achv:MONO_GEN_EIGHT.description", { context: genderStr });
    case "MONO_GEN_NINE":
      return i18next.t("achv:MONO_GEN_NINE.description", { context: genderStr });
    case "MONO_NORMAL":
    case "MONO_FIGHTING":
    case "MONO_FLYING":
    case "MONO_POISON":
    case "MONO_GROUND":
    case "MONO_ROCK":
    case "MONO_BUG":
    case "MONO_GHOST":
    case "MONO_STEEL":
    case "MONO_FIRE":
    case "MONO_WATER":
    case "MONO_GRASS":
    case "MONO_ELECTRIC":
    case "MONO_PSYCHIC":
    case "MONO_ICE":
    case "MONO_DRAGON":
    case "MONO_DARK":
    case "MONO_FAIRY":
      return i18next.t("achv:MonoType.description", {
        context: genderStr,
        type: i18next.t(`pokemonInfo:Type.${localizationKey.slice(5)}`),
      });
    case "FRESH_START":
      return i18next.t("achv:FRESH_START.description", { context: genderStr });
    case "INVERSE_BATTLE":
      return i18next.t("achv:INVERSE_BATTLE.description", { context: genderStr });
    case "BREEDERS_IN_SPACE":
      return i18next.t("achv:BREEDERS_IN_SPACE.description", { context: genderStr });
    default:
      return "";
  }
}

export function initAchievements() {
  const achvKeys = Object.keys(achvs);
  achvKeys.forEach((a: string, i: integer) => {
    achvs[a].id = a;
    if (achvs[a].hasParent) {
      achvs[a].parentId = achvKeys[i - 1];
    }
  });
}
