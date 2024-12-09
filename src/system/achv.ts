import type { ConditionFn } from "#app/@types/common";
import type { Challenge } from "#app/data/challenge";
import { globalScene } from "#app/global-scene";
import { NumberHolder } from "#app/utils";
import { AchvTier } from "#enums/achv-tier";
import { PlayerGender } from "#enums/player-gender";
import i18next from "i18next";
import type { Modifier } from "typescript";

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
