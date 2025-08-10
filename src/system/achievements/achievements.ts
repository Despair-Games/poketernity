import type { Challenge } from "#app/data/challenge";
import { pokemonEvolutions } from "#app/data/init/init-pokemon-evolutions";
import type { SpeciesFormChange } from "#app/data/pokemon-forms";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { PLAYER_PARTY_MAX_SIZE } from "#constants/game-constants";
import { AchvCategory } from "#enums/achv-category";
import { Challenges } from "#enums/challenges";
import { ElementalType } from "#enums/elemental-type";
import type { StarterDataEntry } from "#types/starter-data";
import type { ConditionFn } from "#types/utility-types";
import { enumValueToKey } from "#utils/common-utils";
import i18next from "i18next";

type AchievementLocalesData = {
  nameKey: string;
  descriptionKey: string;
  descriptionArgs?: object;
};

export class Achievement {
  public category: AchvCategory;
  public id: string;
  public localizationInformation: AchievementLocalesData;
  public iconKey: string;
  public conditionFunc: ConditionFn;
  public secret: boolean;

  constructor(id: string, iconKey: string, conditionalFunc?: ConditionFn, achievementCategory?: AchvCategory) {
    this.id = id;
    this.iconKey = iconKey;
    this.localizationInformation = {
      nameKey: id,
      descriptionKey: id,
    };
    if (conditionalFunc) {
      this.conditionFunc = conditionalFunc;
    }
    if (achievementCategory) {
      this.category = achievementCategory;
    }
  }

  public setSecret(): void {
    this.secret = true;
  }
}
export class ClassicCompletionAchievement extends Achievement {
  constructor(id: string, iconKey: string, conditionFunc: ConditionFn) {
    super(id, iconKey, conditionFunc);
    this.category = AchvCategory.CLASSIC_VICTORY;
  }
}

export class ChallengeCompletionAchievement extends Achievement {
  constructor(id: string, iconKey: string, conditionalFunc?: ConditionFn) {
    super(id, iconKey, conditionalFunc);
    this.category = AchvCategory.CHALLENGE_VICTORY;
  }
}

export class MonoGenAchievement extends ChallengeCompletionAchievement {
  constructor(id: string, iconKey: string, generation: number) {
    super(id, iconKey);
    this.conditionFunc = (challanges: Challenge[]) => {
      return (
        challanges.length > 0
        && challanges.some((c) => c.id === Challenges.SINGLE_GENERATION && c.value === generation)
        && !challanges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0)
      );
    };
  }
}

export class MonoTypeAchievement extends ChallengeCompletionAchievement {
  constructor(type: ElementalType, iconKey: string) {
    const typeName = enumValueToKey(ElementalType, type);
    super("MONO_" + typeName, iconKey);
    this.localizationInformation.descriptionKey = "MonoType";
    this.localizationInformation.descriptionArgs = { type: i18next.t(`pokemonInfo:Type.${typeName}`) };
    this.conditionFunc = (challenges: Challenge[]) => {
      return (
        challenges.length > 0
        && challenges.some((c) => c.id === Challenges.SINGLE_TYPE && c.value === type)
        && !challenges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0)
      );
    };
  }
}

export class RibbonAchievement extends Achievement {
  constructor(id: string, iconKey: string, ribbonThreshold: number) {
    super(id, iconKey);
    this.localizationInformation.descriptionKey = "RibbonAchv";
    this.localizationInformation.descriptionArgs = {
      ribbonAmount: ribbonThreshold.toLocaleString(i18next.resolvedLanguage ?? "en-US"),
    };
    this.category = AchvCategory.RIBBON_COUNT;
    this.conditionFunc = (totalRibbons: number) => {
      return totalRibbons >= ribbonThreshold;
    };
  }
}

export const newAchvs = {
  SEE_SHINY: new Achievement(
    "SEE_SHINY",
    "pb_gold",
    (enemyField: Pokemon[]) => {
      return enemyField.some((ep) => ep.isShiny());
    },
    AchvCategory.ENCOUNTER,
  ),
  PERFECT_IVS: new Achievement(
    "PERFECT_IVS",
    "blunder_policy",
    (starterEntry: StarterDataEntry) => {
      return starterEntry.ivs.every((iv) => iv === 31);
    },
    AchvCategory.STARTER,
  ),
  SHINY_PARTY: new Achievement(
    "SHINY_PARTY",
    "shiny_charm",
    (playerParty: Pokemon[]) => {
      return playerParty.length === PLAYER_PARTY_MAX_SIZE && playerParty.every((p) => p.isShiny);
    },
    AchvCategory.PARTY,
  ),
  MEGA_EVOLVE: new Achievement(
    "MEGA_EVOLVE",
    "mega_bracelet",
    (formChange: SpeciesFormChange) => formChange.isMega(),
    AchvCategory.FORM_CHANGE,
  ),
  GIGANTAMAX: new Achievement(
    "GIGANTAMAX",
    "dynamax_band",
    (formChange: SpeciesFormChange) => formChange.isMax(),
    AchvCategory.FORM_CHANGE,
  ),
  TERASTALLIZE: new Achievement(
    "TERASTALLIZE",
    "tera_orb",
    (_et: ElementalType) => {
      return true;
    },
    AchvCategory.TERASTALLIZE,
  ),
  STELLAR_TERASTALLIZE: new Achievement(
    "STELLAR_TERASTALLIZE",
    "stellar_tera_shard",
    (et: ElementalType) => {
      return et === ElementalType.STELLAR;
    },
    AchvCategory.TERASTALLIZE,
  ),
  MAX_FRIENDSHIP: new Achievement(
    "MAX_FRIENDSHIP",
    "soothe_bell",
    (pokemon: Pokemon) => {
      return pokemon.friendship === 255;
    },
    AchvCategory.FRIENDSHIP,
  ),
  CATCH_MYTHICAL: new Achievement(
    "CATCH_MYTHICAL",
    "strange_ball",
    (pokemon: Pokemon) => {
      return pokemon.species.isMythical();
    },
    AchvCategory.CATCH,
  ),
  CATCH_SUB_LEGENDARY: new Achievement(
    "CATCH_SUB_LEGENDARY",
    "rb",
    (pokemon: Pokemon) => {
      return pokemon.species.isLegendLike();
    },
    AchvCategory.CATCH,
  ),
  CATCH_LEGENDARY: new Achievement(
    "CATCH_LEGENDARY",
    "mb",
    (pokemon: Pokemon) => {
      return pokemon.species.isLegendary();
    },
    AchvCategory.CATCH,
  ),
  HIDDEN_ABILITY: new Achievement(
    "HIDDEN_ABILITY",
    "ability_charm",
    (pokemon: Pokemon) => {
      return !!pokemon.species.abilityHidden && pokemon.abilityIndex === pokemon.species.getAbilityCount() - 1;
    },
    AchvCategory.CATCH,
  ),
  _10_RIBBONS: new RibbonAchievement("10_RIBBONS", "bronze_ribbon", 10),
  _25_RIBBONS: new RibbonAchievement("25_RIBBONS", "great_ribbon", 25),
  _50_RIBBONS: new RibbonAchievement("50_RIBBONS", "ultra_ribbon", 50),
  _75_RIBBONS: new RibbonAchievement("75_RIBBONS", "epic_ribbon", 75),
  _100_RIBBONS: new RibbonAchievement("100_RIBBONS", "master_ribbon", 100),
  CLASSIC_VICTORY: new ClassicCompletionAchievement("CLASSIC_VICTORY", "relic_crown", () => {
    return true;
  }),
  UNEVOLVED_CLASSIC_VICTORY: new ClassicCompletionAchievement("UNEVOLVED_CLASSIC_VICTORY", "eviolite", () => {
    return globalScene.getPlayerParty().some((p) => p.getSpeciesForm(true).speciesId in pokemonEvolutions);
  }),
  MONO_GEN_ONE: new MonoGenAchievement("MONO_GEN_ONE", "ribbon_gen1", 1),
  MONO_GEN_TWO: new MonoGenAchievement("MONO_GEN_TWO", "ribbon_gen2", 2),
  MONO_GEN_THREE: new MonoGenAchievement("MONO_GEN_1", "ribbon_gen3", 3),
  MONO_GEN_FOUR: new MonoGenAchievement("MONO_GEN_1", "ribbon_gen4", 4),
  MONO_GEN_FIVE: new MonoGenAchievement("MONO_GEN_1", "ribbon_gen5", 5),
  MONO_GEN_SIX: new MonoGenAchievement("MONO_GEN_1", "ribbon_gen6", 6),
  MONO_GEN_SEVEN: new MonoGenAchievement("MONO_GEN_1", "ribbon_gen7", 7),
  MONO_GEN_EIGHT: new MonoGenAchievement("MONO_GEN_1", "ribbon_gen8", 8),
  MONO_GEN_NINE: new MonoGenAchievement("MONO_GEN_1", "ribbon_gen9", 9),
  MONO_NORMAL: new MonoTypeAchievement(ElementalType.NORMAL, "silk_scarf"),
  MONO_FIGHTING: new MonoTypeAchievement(ElementalType.FIGHTING, "black_belt"),
  MONO_FLYING: new MonoTypeAchievement(ElementalType.FLYING, "sharp_beak"),
  MONO_POISON: new MonoTypeAchievement(ElementalType.POISON, "poison_barb"),
  MONO_GROUND: new MonoTypeAchievement(ElementalType.GROUND, "soft_sand"),
  MONO_ROCK: new MonoTypeAchievement(ElementalType.ROCK, "hard_stone"),
  MONO_BUG: new MonoTypeAchievement(ElementalType.BUG, "silver_powder"),
  MONO_GHOST: new MonoTypeAchievement(ElementalType.GHOST, "spell_tag"),
  MONO_STEEL: new MonoTypeAchievement(ElementalType.STEEL, "metal_coat"),
  MONO_FIRE: new MonoTypeAchievement(ElementalType.FIRE, "charcoal"),
  MONO_WATER: new MonoTypeAchievement(ElementalType.WATER, "mystic_water"),
  MONO_GRASS: new MonoTypeAchievement(ElementalType.GRASS, "miracle_seed"),
  MONO_ELECTRIC: new MonoTypeAchievement(ElementalType.ELECTRIC, "magnet"),
  MONO_PSYCHIC: new MonoTypeAchievement(ElementalType.PSYCHIC, "twisted_spoon"),
  MONO_ICE: new MonoTypeAchievement(ElementalType.ICE, "never_melt_ice"),
  MONO_DRAGON: new MonoTypeAchievement(ElementalType.DRAGON, "dragon_fang"),
  MONO_DARK: new MonoTypeAchievement(ElementalType.DARK, "black_glasses"),
  MONO_FAIRY: new MonoTypeAchievement(ElementalType.FAIRY, "fairy_feather"),
  FRESH_START: new ChallengeCompletionAchievement(
    "FRESH_START",
    "reviver_seed",
    (challenges: Challenge[]) =>
      challenges.length > 0 && challenges.some((c) => c.isFreshStartChallenge() && c.value > 0),
  ),
  INVERSE_BATTLE: new ChallengeCompletionAchievement(
    "INVERSE_BATTLE",
    "inverse",
    (challenges: Challenge[]) =>
      challenges.length > 0
      && challenges.some(
        (ch) =>
          ch.isInverseBattleChallenge()
          && ch.value > 0
          && !globalScene.gameMode.challenges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0),
      ),
  ),
};

export function initNewAchvs(): void {
  // console.log(newAchvs);
  const achvKeys = Object.keys(newAchvs);
  achvKeys.forEach((a: string) => {
    newAchvs[a].id = a;
  });
}
