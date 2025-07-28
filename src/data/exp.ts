import { globalScene } from "#app/global-scene";
import { CommonColor, ShadowColor } from "#enums/color";
import { GrowthRate } from "#enums/growth-rate";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { PlayerPokemon } from "#field/player-pokemon";
import type { Pokemon } from "#field/pokemon";

/**
 * A look up table containing the total amount of EXP required to reach each level (for the first `100` levels), ordered by growth rate:
 * Erratic, fast, medium fast, medium slow, slow, fluctuating
 */
const expLevels = [
  [
    0, 15, 52, 122, 237, 406, 637, 942, 1326, 1800, 2369, 3041, 3822, 4719, 5737, 6881, 8155, 9564, 11111, 12800, 14632,
    16610, 18737, 21012, 23437, 26012, 28737, 31610, 34632, 37800, 41111, 44564, 48155, 51881, 55737, 59719, 63822,
    68041, 72369, 76800, 81326, 85942, 90637, 95406, 100237, 105122, 110052, 115015, 120001, 125000, 131324, 137795,
    144410, 151165, 158056, 165079, 172229, 179503, 186894, 194400, 202013, 209728, 217540, 225443, 233431, 241496,
    249633, 257834, 267406, 276458, 286328, 296358, 305767, 316074, 326531, 336255, 346965, 357812, 367807, 378880,
    390077, 400293, 411686, 423190, 433572, 445239, 457001, 467489, 479378, 491346, 501878, 513934, 526049, 536557,
    548720, 560922, 571333, 583539, 591882, 600000,
  ],
  [
    0, 6, 21, 51, 100, 172, 274, 409, 583, 800, 1064, 1382, 1757, 2195, 2700, 3276, 3930, 4665, 5487, 6400, 7408, 8518,
    9733, 11059, 12500, 14060, 15746, 17561, 19511, 21600, 23832, 26214, 28749, 31443, 34300, 37324, 40522, 43897,
    47455, 51200, 55136, 59270, 63605, 68147, 72900, 77868, 83058, 88473, 94119, 100000, 106120, 112486, 119101, 125971,
    133100, 140492, 148154, 156089, 164303, 172800, 181584, 190662, 200037, 209715, 219700, 229996, 240610, 251545,
    262807, 274400, 286328, 298598, 311213, 324179, 337500, 351180, 365226, 379641, 394431, 409600, 425152, 441094,
    457429, 474163, 491300, 508844, 526802, 545177, 563975, 583200, 602856, 622950, 643485, 664467, 685900, 707788,
    730138, 752953, 776239, 800000,
  ],
  [
    0, 8, 27, 64, 125, 216, 343, 512, 729, 1000, 1331, 1728, 2197, 2744, 3375, 4096, 4913, 5832, 6859, 8000, 9261,
    10648, 12167, 13824, 15625, 17576, 19683, 21952, 24389, 27000, 29791, 32768, 35937, 39304, 42875, 46656, 50653,
    54872, 59319, 64000, 68921, 74088, 79507, 85184, 91125, 97336, 103823, 110592, 117649, 125000, 132651, 140608,
    148877, 157464, 166375, 175616, 185193, 195112, 205379, 216000, 226981, 238328, 250047, 262144, 274625, 287496,
    300763, 314432, 328509, 343000, 357911, 373248, 389017, 405224, 421875, 438976, 456533, 474552, 493039, 512000,
    531441, 551368, 571787, 592704, 614125, 636056, 658503, 681472, 704969, 729000, 753571, 778688, 804357, 830584,
    857375, 884736, 912673, 941192, 970299, 1000000,
  ],
  [
    0, 9, 57, 96, 135, 179, 236, 314, 419, 560, 742, 973, 1261, 1612, 2035, 2535, 3120, 3798, 4575, 5460, 6458, 7577,
    8825, 10208, 11735, 13411, 15244, 17242, 19411, 21760, 24294, 27021, 29949, 33084, 36435, 40007, 43808, 47846,
    52127, 56660, 61450, 66505, 71833, 77440, 83335, 89523, 96012, 102810, 109923, 117360, 125126, 133229, 141677,
    150476, 159635, 169159, 179056, 189334, 199999, 211060, 222522, 234393, 246681, 259392, 272535, 286115, 300140,
    314618, 329555, 344960, 360838, 377197, 394045, 411388, 429235, 447591, 466464, 485862, 505791, 526260, 547274,
    568841, 590969, 613664, 636935, 660787, 685228, 710266, 735907, 762160, 789030, 816525, 844653, 873420, 902835,
    932903, 963632, 995030, 1027103, 1059860,
  ],
  [
    0, 10, 33, 80, 156, 270, 428, 640, 911, 1250, 1663, 2160, 2746, 3430, 4218, 5120, 6141, 7290, 8573, 10000, 11576,
    13310, 15208, 17280, 19531, 21970, 24603, 27440, 30486, 33750, 37238, 40960, 44921, 49130, 53593, 58320, 63316,
    68590, 74148, 80000, 86151, 92610, 99383, 106480, 113906, 121670, 129778, 138240, 147061, 156250, 165813, 175760,
    186096, 196830, 207968, 219520, 231491, 243890, 256723, 270000, 283726, 297910, 312558, 327680, 343281, 359370,
    375953, 393040, 410636, 428750, 447388, 466560, 486271, 506530, 527343, 548720, 570666, 593190, 616298, 640000,
    664301, 689210, 714733, 740880, 767656, 795070, 823128, 851840, 881211, 911250, 941963, 973360, 1005446, 1038230,
    1071718, 1105920, 1140841, 1176490, 1212873, 1250000,
  ],
  [
    0, 4, 13, 32, 65, 112, 178, 276, 393, 540, 745, 967, 1230, 1591, 1957, 2457, 3046, 3732, 4526, 5440, 6482, 7666,
    9003, 10506, 12187, 14060, 16140, 18439, 20974, 23760, 26811, 30146, 33780, 37731, 42017, 46656, 50653, 55969,
    60505, 66560, 71677, 78533, 84277, 91998, 98415, 107069, 114205, 123863, 131766, 142500, 151222, 163105, 172697,
    185807, 196322, 210739, 222231, 238036, 250562, 267840, 281456, 300293, 315059, 335544, 351520, 373744, 390991,
    415050, 433631, 459620, 479600, 507617, 529063, 559209, 582187, 614566, 639146, 673863, 700115, 737280, 765275,
    804997, 834809, 877201, 908905, 954084, 987754, 1035837, 1071552, 1122660, 1160499, 1214753, 1254796, 1312322,
    1354652, 1415577, 1460276, 1524731, 1571884, 1640000,
  ],
];

/**
 * Custom legacy value so that Pokemon with slower leveling rates would be better.
 *
 * TODO: See if this needs tweaking (or is needed at all) and then update the above hardcoded
 * arrays for more optimization
 */
const SMOOTHING_FACTOR = 0.675;

/**
 * Function to calculate the amount of EXP required for a given level based on growth rate.
 *
 * If the growth rate is not `MEDIUM_FAST` then it is smoothed with `MEDIUM_FAST`
 * (The growth rate only contributes `32.5%` of the formula, the other `67.5%` is `MEDIUM_FAST`)
 * @returns The total amount of EXP required to get from level `1` (`0` EXP) to the input level
 */
export function getLevelTotalExp(level: number, growthRate: GrowthRate): number {
  if (level < 100) {
    const levelExp = expLevels[growthRate - 1][level - 1];
    if (growthRate !== GrowthRate.MEDIUM_FAST) {
      return Math.floor(
        levelExp * (1 - SMOOTHING_FACTOR) + getLevelTotalExp(level, GrowthRate.MEDIUM_FAST) * SMOOTHING_FACTOR,
      );
    }
    return levelExp;
  }

  let ret: number;

  switch (growthRate) {
    case GrowthRate.ERRATIC:
      // Custom: There is no erratic formula past level 100 so this is totally custom
      ret = (Math.pow(level, 4) + Math.pow(level, 3) * 2000) / 3500;
      break;
    case GrowthRate.FAST:
      ret = (Math.pow(level, 3) * 4) / 5;
      break;
    case GrowthRate.MEDIUM_FAST:
      ret = Math.pow(level, 3);
      break;
    case GrowthRate.MEDIUM_SLOW:
      ret = (Math.pow(level, 3) * 6) / 5 - 15 * Math.pow(level, 2) + 100 * level - 140;
      break;
    case GrowthRate.SLOW:
      ret = (Math.pow(level, 3) * 5) / 4;
      break;
    case GrowthRate.FLUCTUATING:
      // Custom: There is no fluctuating formula past level 100 so this is totally custom
      ret = (Math.pow(level, 3) * (level / 2 + 8) * 4) / (100 + level);
      break;
  }

  if (growthRate !== GrowthRate.MEDIUM_FAST) {
    return Math.floor(
      ret * (1 - SMOOTHING_FACTOR) + getLevelTotalExp(level, GrowthRate.MEDIUM_FAST) * SMOOTHING_FACTOR,
    );
  }

  return Math.floor(ret);
}

/**
 * @returns The amount of EXP required to go from `level - 1` to `level`
 */
export function getLevelRelExp(level: number, growthRate: GrowthRate): number {
  return getLevelTotalExp(level, growthRate) - getLevelTotalExp(level - 1, growthRate);
}

/**
 * Gets the level for a wild Pokemon for a given wave
 * The formula were derived as a series of linear functions with specific breakpoints
 * (10, 10), (20, 15), (70, 30), (100, 40), (170, 65), (180, 70), (190, 79), and (200, 83)
 *
 * @param wave - The adjusted wave based on whether or not the game is daily mode
 * @returns the level for the wave
 */
export function getLevelForWaveFunc(wave: number): number {
  if (wave < 11) {
    // Level cap of 10 * 1.2 = 12 at wave 10
    return wave;
  }
  if (wave < 21) {
    // Level cap of 15 * 1.2 = 18 at wave 20
    return Math.floor(0.5 * wave + 5);
  }
  if (wave < 71) {
    // Level cap of 30 * 1.2 = 36 at wave 70
    return Math.floor(0.3 * wave + 9);
  }
  if (wave < 101) {
    // Level cap of 50 * 1.2 = 48 at wave 100
    return Math.floor(0.366 * wave + 4.33);
  }
  if (wave < 171) {
    // Level cap of 65 * 1.2 = 78 at wave 170
    return Math.floor(0.371 * wave + 2.86);
  }
  if (wave < 181) {
    // Level cap of 70 * 1.2 = 84 at wave 180
    return Math.floor(0.5 * wave - 20);
  }
  if (wave < 191) {
    // Level cap of 79 * 1.2 = 95 at wave 190
    return Math.floor(0.9 * wave - 92);
  }
  if (wave < 201) {
    // Level cap of 83 * 1.2 = 100 at wave 200
    return Math.floor(0.4 * wave + 3);
  }
  // Temporary scaling value for now
  return Math.floor(0.5 * wave);
}

/**
 * @returns The color to display in the starter select UI for each growth rate
 */
export function getGrowthRateColor(growthRate: GrowthRate) {
  switch (growthRate) {
    case GrowthRate.ERRATIC:
      return CommonColor.BRIGHT_PINK;
    case GrowthRate.FAST:
      return CommonColor.GOLD_YELLOW;
    case GrowthRate.MEDIUM_FAST:
      return CommonColor.LIGHT_GREEN;
    case GrowthRate.MEDIUM_SLOW:
      return CommonColor.SOFT_BLUE;
    case GrowthRate.SLOW:
      return CommonColor.BRIGHT_ORANGE;
    case GrowthRate.FLUCTUATING:
      return CommonColor.VIBRANT_PURPLE;
  }
}

/**
 * Function to get the exp given from a defeated Pokemon from gen 1-4
 *
 * Not included from the mainline formula:
 * - Original Trainer bonus
 */
export function genOneThroughFourExpFormula(defeatedPokemon: Pokemon): number {
  const baseExp = defeatedPokemon.species.baseExp;
  const enemyLevel = defeatedPokemon.level;
  // The Exp share multiplier is handled elsewhere (TODO: change that?)
  const expShareMultiplier = 1;
  // The Lucky Egg bonus is handled elsewhere (TODO: change that?)
  const luckyEggBonus = 1;
  const trainerExpBonus = globalScene.currentBattle.isTrainerBattle(true) ? 1.5 : 1;

  const baseExpGain = (baseExp * enemyLevel) / 7;

  const expGained = baseExpGain * expShareMultiplier * luckyEggBonus * trainerExpBonus;
  return Math.floor(expGained);
}

/**
 * Function to get the exp given to a Pokemon from a defeated Pokemon in gen 5
 *
 * BW2 has a cap of 100,000 but that is ignored here.
 *
 * Not included from the mainline formula:
 * - Original Trainer bonus
 * - Exp Power Point bonus
 */
export function genFiveExpFormula(defeatedPokemon: EnemyPokemon, playerPokemon: PlayerPokemon) {
  const baseExp = defeatedPokemon.species.baseExp;
  const playerLevel = playerPokemon.level;
  const enemyLevel = defeatedPokemon.level;
  // The Exp share multiplier is handled elsewhere (TODO: change that?)
  const expShareMultiplier = 1;
  // The Lucky Egg bonus is handled elsewhere (TODO: change that?)
  const luckyEggBonus = 1;
  const trainerExpBonus = globalScene.currentBattle.isTrainerBattle(true) ? 1.5 : 1;

  const baseExpGain = (baseExp * enemyLevel) / 5;

  const levelScalingNumerator = Math.floor(
    Math.round(Math.sqrt(2 * enemyLevel + 10)) * Math.pow(2 * enemyLevel + 10, 2),
  );
  const levelScalingDenominator = Math.floor(
    Math.round(Math.sqrt(playerLevel + enemyLevel + 10)) * Math.pow(playerLevel + enemyLevel + 10, 2),
  );
  const levelScalingFactor = levelScalingNumerator / levelScalingDenominator;

  const gainedExp = (baseExpGain * expShareMultiplier * trainerExpBonus * levelScalingFactor + 1) * luckyEggBonus;
  return Math.floor(gainedExp);
}

/**
 * Function to get the exp given to a Pokemon from a defeated Pokemon in gen 6
 *
 * Not included from the mainline formula:
 * - Original Trainer bonus
 * - O-Power bonus
 */
export function genSixExpFormula(defeatedPokemon: EnemyPokemon, playerPokemon: PlayerPokemon) {
  const baseExp = defeatedPokemon.species.baseExp;
  const enemyLevel = defeatedPokemon.level;
  // The Exp share multiplier is handled elsewhere (TODO: change that?)
  const expShareMultiplier = 1;
  // The Lucky Egg bonus is handled elsewhere (TODO: change that?)
  const luckyEggBonus = 1;
  const trainerExpBonus = globalScene.currentBattle.isTrainerBattle(true) ? 1.5 : 1;
  const friendshipBonus = playerPokemon.friendship >= 220 ? 1.2 : 1;
  // If the player Pokemon is past the level it can normally evolve this should be 1.2, currently unused
  // TODO: use this?
  const canEvolveBonus = 1;

  const baseExpGain = (baseExp * enemyLevel) / 7;

  const expGained =
    baseExpGain * expShareMultiplier * luckyEggBonus * trainerExpBonus * friendshipBonus * canEvolveBonus;
  return Math.floor(expGained);
}

/**
 * Function to get the exp given to a Pokemon from a defeated Pokemon in gen 7+
 *
 * Not included from the mainline formula:
 * - Original Trainer bonus
 * - Rotom Power bonus
 */
export function genSevenPlusExpFormula(defeatedPokemon: EnemyPokemon, playerPokemon: PlayerPokemon) {
  const baseExp = defeatedPokemon.species.baseExp;
  const enemyLevel = defeatedPokemon.level;
  const playerLevel = playerPokemon.level;
  // The Exp share multiplier is handled elsewhere (TODO: change that?)
  const expShareMultiplier = 1;
  // The Lucky Egg bonus is handled elsewhere (TODO: change that?)
  const luckyEggBonus = 1;
  const trainerExpBonus = globalScene.currentBattle.isTrainerBattle(true) ? 1.5 : 1;
  const friendshipBonus = playerPokemon.friendship >= 220 ? 1.2 : 1;
  // If the player Pokemon is past the level it can normally evolve this should be 1.2, currently unused
  // TODO: use this?
  const canEvolveBonus = 1;

  const baseExpGain = (baseExp * enemyLevel) / 5;
  const levelScalingFactor = Math.pow((2 * enemyLevel + 10) / (playerLevel + enemyLevel + 10), 2.5);
  const innerTerm = baseExpGain * levelScalingFactor * expShareMultiplier + 1;

  const expGained = innerTerm * luckyEggBonus * trainerExpBonus * friendshipBonus * canEvolveBonus;
  return Math.floor(expGained);
}

/**
 * @returns The shadow color to display in the starter select UI for each growth rate
 */
export function getGrowthRateShadowColor(growthRate: GrowthRate) {
  switch (growthRate) {
    case GrowthRate.ERRATIC:
      return ShadowColor.DUSTY_ROSE;
    case GrowthRate.FAST:
      return ShadowColor.MUTED_GOLD;
    case GrowthRate.MEDIUM_FAST:
      return ShadowColor.MUTED_GREEN;
    case GrowthRate.MEDIUM_SLOW:
      return ShadowColor.DARK_GREY;
    case GrowthRate.SLOW:
      return ShadowColor.DARK_RED;
    case GrowthRate.FLUCTUATING:
      return ShadowColor.DARK_PURPLE;
  }
}
