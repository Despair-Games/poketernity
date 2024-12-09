import { pokemonEvolutions } from "#app/data/balance/pokemon-evolutions";
import {
  FreshStartChallenge,
  InverseBattleChallenge,
  SingleGenerationChallenge,
  SingleTypeChallenge,
} from "#app/data/challenge";
import { globalScene } from "#app/global-scene";
import { TurnHeldItemTransferModifier } from "#app/modifier/modifier";
import { Challenges } from "#enums/challenges";
import { Achv, ChallengeAchv, DamageAchv, HealAchv, LevelAchv, ModifierAchv, MoneyAchv, RibbonAchv } from "./achv";

export const achvs = {
  _10K_MONEY: new MoneyAchv("10K_MONEY", "", 10000, "nugget", 10),
  _100K_MONEY: new MoneyAchv("100K_MONEY", "", 100000, "big_nugget", 25).setSecret(true),
  _1M_MONEY: new MoneyAchv("1M_MONEY", "", 1000000, "relic_gold", 50).setSecret(true),
  _10M_MONEY: new MoneyAchv("10M_MONEY", "", 10000000, "coin_case", 100).setSecret(true),
  _250_DMG: new DamageAchv("250_DMG", "", 250, "lucky_punch", 10),
  _1000_DMG: new DamageAchv("1000_DMG", "", 1000, "lucky_punch_great", 25).setSecret(true),
  _2500_DMG: new DamageAchv("2500_DMG", "", 2500, "lucky_punch_ultra", 50).setSecret(true),
  _10000_DMG: new DamageAchv("10000_DMG", "", 10000, "lucky_punch_master", 100).setSecret(true),
  _250_HEAL: new HealAchv("250_HEAL", "", 250, "potion", 10),
  _1000_HEAL: new HealAchv("1000_HEAL", "", 1000, "super_potion", 25).setSecret(true),
  _2500_HEAL: new HealAchv("2500_HEAL", "", 2500, "hyper_potion", 50).setSecret(true),
  _10000_HEAL: new HealAchv("10000_HEAL", "", 10000, "max_potion", 100).setSecret(true),
  LV_100: new LevelAchv("LV_100", "", 100, "rare_candy", 25).setSecret(),
  LV_250: new LevelAchv("LV_250", "", 250, "rarer_candy", 50).setSecret(true),
  LV_1000: new LevelAchv("LV_1000", "", 1000, "candy_jar", 100).setSecret(true),
  _10_RIBBONS: new RibbonAchv("10_RIBBONS", "", 10, "bronze_ribbon", 10),
  _25_RIBBONS: new RibbonAchv("25_RIBBONS", "", 25, "great_ribbon", 25).setSecret(true),
  _50_RIBBONS: new RibbonAchv("50_RIBBONS", "", 50, "ultra_ribbon", 50).setSecret(true),
  _75_RIBBONS: new RibbonAchv("75_RIBBONS", "", 75, "epic_ribbon", 75).setSecret(true),
  _100_RIBBONS: new RibbonAchv("100_RIBBONS", "", 100, "master_ribbon", 100).setSecret(true),
  TRANSFER_MAX_STAT_STAGE: new Achv("TRANSFER_MAX_STAT_STAGE", "", "TRANSFER_MAX_STAT_STAGE.description", "baton", 20),
  MAX_FRIENDSHIP: new Achv("MAX_FRIENDSHIP", "", "MAX_FRIENDSHIP.description", "soothe_bell", 25),
  MEGA_EVOLVE: new Achv("MEGA_EVOLVE", "", "MEGA_EVOLVE.description", "mega_bracelet", 50),
  GIGANTAMAX: new Achv("GIGANTAMAX", "", "GIGANTAMAX.description", "dynamax_band", 50),
  TERASTALLIZE: new Achv("TERASTALLIZE", "", "TERASTALLIZE.description", "tera_orb", 25),
  STELLAR_TERASTALLIZE: new Achv(
    "STELLAR_TERASTALLIZE",
    "",
    "STELLAR_TERASTALLIZE.description",
    "stellar_tera_shard",
    25,
  ).setSecret(true),
  SPLICE: new Achv("SPLICE", "", "SPLICE.description", "dna_splicers", 10),
  MINI_BLACK_HOLE: new ModifierAchv(
    "MINI_BLACK_HOLE",
    "",
    "MINI_BLACK_HOLE.description",
    "mini_black_hole",
    25,
    (modifier) => modifier instanceof TurnHeldItemTransferModifier,
  ).setSecret(),
  CATCH_MYTHICAL: new Achv("CATCH_MYTHICAL", "", "CATCH_MYTHICAL.description", "strange_ball", 50).setSecret(),
  CATCH_SUB_LEGENDARY: new Achv("CATCH_SUB_LEGENDARY", "", "CATCH_SUB_LEGENDARY.description", "rb", 75).setSecret(),
  CATCH_LEGENDARY: new Achv("CATCH_LEGENDARY", "", "CATCH_LEGENDARY.description", "mb", 100).setSecret(),
  SEE_SHINY: new Achv("SEE_SHINY", "", "SEE_SHINY.description", "pb_gold", 75),
  SHINY_PARTY: new Achv("SHINY_PARTY", "", "SHINY_PARTY.description", "shiny_charm", 100).setSecret(true),
  HATCH_MYTHICAL: new Achv("HATCH_MYTHICAL", "", "HATCH_MYTHICAL.description", "mystery_egg", 75).setSecret(),
  HATCH_SUB_LEGENDARY: new Achv(
    "HATCH_SUB_LEGENDARY",
    "",
    "HATCH_SUB_LEGENDARY.description",
    "oval_stone",
    100,
  ).setSecret(),
  HATCH_LEGENDARY: new Achv("HATCH_LEGENDARY", "", "HATCH_LEGENDARY.description", "lucky_egg", 125).setSecret(),
  HATCH_SHINY: new Achv("HATCH_SHINY", "", "HATCH_SHINY.description", "golden_egg", 100).setSecret(),
  HIDDEN_ABILITY: new Achv("HIDDEN_ABILITY", "", "HIDDEN_ABILITY.description", "ability_charm", 75),
  PERFECT_IVS: new Achv("PERFECT_IVS", "", "PERFECT_IVS.description", "blunder_policy", 100),
  CLASSIC_VICTORY: new Achv(
    "CLASSIC_VICTORY",
    "",
    "CLASSIC_VICTORY.description",
    "relic_crown",
    150,
    (_) => globalScene.gameData.gameStats.sessionsWon === 0,
  ),
  UNEVOLVED_CLASSIC_VICTORY: new Achv(
    "UNEVOLVED_CLASSIC_VICTORY",
    "",
    "UNEVOLVED_CLASSIC_VICTORY.description",
    "eviolite",
    175,
    (_) => globalScene.getPlayerParty().some((p) => p.getSpeciesForm(true).speciesId in pokemonEvolutions),
  ),
  MONO_GEN_ONE_VICTORY: new ChallengeAchv(
    "MONO_GEN_ONE",
    "",
    "MONO_GEN_ONE.description",
    "ribbon_gen1",
    100,
    (c) =>
      c instanceof SingleGenerationChallenge
      && c.value === 1
      && !globalScene.gameMode.challenges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0),
  ),
  MONO_GEN_TWO_VICTORY: new ChallengeAchv(
    "MONO_GEN_TWO",
    "",
    "MONO_GEN_TWO.description",
    "ribbon_gen2",
    100,
    (c) =>
      c instanceof SingleGenerationChallenge
      && c.value === 2
      && !globalScene.gameMode.challenges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0),
  ),
  MONO_GEN_THREE_VICTORY: new ChallengeAchv(
    "MONO_GEN_THREE",
    "",
    "MONO_GEN_THREE.description",
    "ribbon_gen3",
    100,
    (c) =>
      c instanceof SingleGenerationChallenge
      && c.value === 3
      && !globalScene.gameMode.challenges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0),
  ),
  MONO_GEN_FOUR_VICTORY: new ChallengeAchv(
    "MONO_GEN_FOUR",
    "",
    "MONO_GEN_FOUR.description",
    "ribbon_gen4",
    100,
    (c) =>
      c instanceof SingleGenerationChallenge
      && c.value === 4
      && !globalScene.gameMode.challenges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0),
  ),
  MONO_GEN_FIVE_VICTORY: new ChallengeAchv(
    "MONO_GEN_FIVE",
    "",
    "MONO_GEN_FIVE.description",
    "ribbon_gen5",
    100,
    (c) =>
      c instanceof SingleGenerationChallenge
      && c.value === 5
      && !globalScene.gameMode.challenges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0),
  ),
  MONO_GEN_SIX_VICTORY: new ChallengeAchv(
    "MONO_GEN_SIX",
    "",
    "MONO_GEN_SIX.description",
    "ribbon_gen6",
    100,
    (c) =>
      c instanceof SingleGenerationChallenge
      && c.value === 6
      && !globalScene.gameMode.challenges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0),
  ),
  MONO_GEN_SEVEN_VICTORY: new ChallengeAchv(
    "MONO_GEN_SEVEN",
    "",
    "MONO_GEN_SEVEN.description",
    "ribbon_gen7",
    100,
    (c) =>
      c instanceof SingleGenerationChallenge
      && c.value === 7
      && !globalScene.gameMode.challenges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0),
  ),
  MONO_GEN_EIGHT_VICTORY: new ChallengeAchv(
    "MONO_GEN_EIGHT",
    "",
    "MONO_GEN_EIGHT.description",
    "ribbon_gen8",
    100,
    (c) =>
      c instanceof SingleGenerationChallenge
      && c.value === 8
      && !globalScene.gameMode.challenges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0),
  ),
  MONO_GEN_NINE_VICTORY: new ChallengeAchv(
    "MONO_GEN_NINE",
    "",
    "MONO_GEN_NINE.description",
    "ribbon_gen9",
    100,
    (c) =>
      c instanceof SingleGenerationChallenge
      && c.value === 9
      && !globalScene.gameMode.challenges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0),
  ),
  MONO_NORMAL: new ChallengeAchv(
    "MONO_NORMAL",
    "",
    "MONO_NORMAL.description",
    "silk_scarf",
    100,
    (c) =>
      c instanceof SingleTypeChallenge
      && c.value === 1
      && !globalScene.gameMode.challenges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0),
  ),
  MONO_FIGHTING: new ChallengeAchv(
    "MONO_FIGHTING",
    "",
    "MONO_FIGHTING.description",
    "black_belt",
    100,
    (c) =>
      c instanceof SingleTypeChallenge
      && c.value === 2
      && !globalScene.gameMode.challenges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0),
  ),
  MONO_FLYING: new ChallengeAchv(
    "MONO_FLYING",
    "",
    "MONO_FLYING.description",
    "sharp_beak",
    100,
    (c) =>
      c instanceof SingleTypeChallenge
      && c.value === 3
      && !globalScene.gameMode.challenges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0),
  ),
  MONO_POISON: new ChallengeAchv(
    "MONO_POISON",
    "",
    "MONO_POISON.description",
    "poison_barb",
    100,
    (c) =>
      c instanceof SingleTypeChallenge
      && c.value === 4
      && !globalScene.gameMode.challenges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0),
  ),
  MONO_GROUND: new ChallengeAchv(
    "MONO_GROUND",
    "",
    "MONO_GROUND.description",
    "soft_sand",
    100,
    (c) =>
      c instanceof SingleTypeChallenge
      && c.value === 5
      && !globalScene.gameMode.challenges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0),
  ),
  MONO_ROCK: new ChallengeAchv(
    "MONO_ROCK",
    "",
    "MONO_ROCK.description",
    "hard_stone",
    100,
    (c) =>
      c instanceof SingleTypeChallenge
      && c.value === 6
      && !globalScene.gameMode.challenges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0),
  ),
  MONO_BUG: new ChallengeAchv(
    "MONO_BUG",
    "",
    "MONO_BUG.description",
    "silver_powder",
    100,
    (c) =>
      c instanceof SingleTypeChallenge
      && c.value === 7
      && !globalScene.gameMode.challenges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0),
  ),
  MONO_GHOST: new ChallengeAchv(
    "MONO_GHOST",
    "",
    "MONO_GHOST.description",
    "spell_tag",
    100,
    (c) =>
      c instanceof SingleTypeChallenge
      && c.value === 8
      && !globalScene.gameMode.challenges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0),
  ),
  MONO_STEEL: new ChallengeAchv(
    "MONO_STEEL",
    "",
    "MONO_STEEL.description",
    "metal_coat",
    100,
    (c) =>
      c instanceof SingleTypeChallenge
      && c.value === 9
      && !globalScene.gameMode.challenges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0),
  ),
  MONO_FIRE: new ChallengeAchv(
    "MONO_FIRE",
    "",
    "MONO_FIRE.description",
    "charcoal",
    100,
    (c) =>
      c instanceof SingleTypeChallenge
      && c.value === 10
      && !globalScene.gameMode.challenges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0),
  ),
  MONO_WATER: new ChallengeAchv(
    "MONO_WATER",
    "",
    "MONO_WATER.description",
    "mystic_water",
    100,
    (c) =>
      c instanceof SingleTypeChallenge
      && c.value === 11
      && !globalScene.gameMode.challenges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0),
  ),
  MONO_GRASS: new ChallengeAchv(
    "MONO_GRASS",
    "",
    "MONO_GRASS.description",
    "miracle_seed",
    100,
    (c) =>
      c instanceof SingleTypeChallenge
      && c.value === 12
      && !globalScene.gameMode.challenges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0),
  ),
  MONO_ELECTRIC: new ChallengeAchv(
    "MONO_ELECTRIC",
    "",
    "MONO_ELECTRIC.description",
    "magnet",
    100,
    (c) =>
      c instanceof SingleTypeChallenge
      && c.value === 13
      && !globalScene.gameMode.challenges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0),
  ),
  MONO_PSYCHIC: new ChallengeAchv(
    "MONO_PSYCHIC",
    "",
    "MONO_PSYCHIC.description",
    "twisted_spoon",
    100,
    (c) =>
      c instanceof SingleTypeChallenge
      && c.value === 14
      && !globalScene.gameMode.challenges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0),
  ),
  MONO_ICE: new ChallengeAchv(
    "MONO_ICE",
    "",
    "MONO_ICE.description",
    "never_melt_ice",
    100,
    (c) =>
      c instanceof SingleTypeChallenge
      && c.value === 15
      && !globalScene.gameMode.challenges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0),
  ),
  MONO_DRAGON: new ChallengeAchv(
    "MONO_DRAGON",
    "",
    "MONO_DRAGON.description",
    "dragon_fang",
    100,
    (c) =>
      c instanceof SingleTypeChallenge
      && c.value === 16
      && !globalScene.gameMode.challenges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0),
  ),
  MONO_DARK: new ChallengeAchv(
    "MONO_DARK",
    "",
    "MONO_DARK.description",
    "black_glasses",
    100,
    (c) =>
      c instanceof SingleTypeChallenge
      && c.value === 17
      && !globalScene.gameMode.challenges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0),
  ),
  MONO_FAIRY: new ChallengeAchv(
    "MONO_FAIRY",
    "",
    "MONO_FAIRY.description",
    "fairy_feather",
    100,
    (c) =>
      c instanceof SingleTypeChallenge
      && c.value === 18
      && !globalScene.gameMode.challenges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0),
  ),
  FRESH_START: new ChallengeAchv(
    "FRESH_START",
    "",
    "FRESH_START.description",
    "reviver_seed",
    100,
    (c) =>
      c instanceof FreshStartChallenge
      && c.value > 0
      && !globalScene.gameMode.challenges.some((c) => c.id === Challenges.INVERSE_BATTLE && c.value > 0),
  ),
  INVERSE_BATTLE: new ChallengeAchv(
    "INVERSE_BATTLE",
    "",
    "INVERSE_BATTLE.description",
    "inverse",
    100,
    (c) => c instanceof InverseBattleChallenge && c.value > 0,
  ),
  BREEDERS_IN_SPACE: new Achv("BREEDERS_IN_SPACE", "", "BREEDERS_IN_SPACE.description", "moon_stone", 50).setSecret(),
};
