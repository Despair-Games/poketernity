export enum CommonColor {
  /** #ffffff */
  WHITE = "#ffffff",
  /** #f8f8f8 */
  OFF_WHITE = "#f8f8f8",
  /** #a0a0a0 */
  LIGHT_GREY = "#a0a0a0",
  /** #484848 */
  GREY = "#484848",
  /** #404040 */
  DARK_GREY = "#404040",

  // Reds & Pinks
  /** #f89890 */
  SOFT_PINK = "#f89890",
  /** #f88880 */
  CORAL_PINK = "#f88880",
  /** #f85888 */
  BRIGHT_PINK = "#f85888",
  /** #ff0000 */
  PURE_RED = "#ff0000",
  /** #e13d3d */
  WARM_RED = "#e13d3d",
  /** #e70808 */
  DEEP_RED = "#e70808",

  /** #a040a0 */
  VIBRANT_PURPLE = "#a040a0",

  // Oranges & Yellows
  /** #f8b050 */
  SOFT_ORANGE = "#f8b050",
  /** #f08030 */
  BRIGHT_ORANGE = "#f08030",
  /** #d64b00 */
  DEEP_ORANGE = "#d64b00",
  /** #f8d030 */
  GOLD_YELLOW = "#f8d030",
  /** #e8e8a8 */
  MUTED_YELLOW = "#e8e8a8",
  /** #ccbe00 */
  DEEP_YELLOW = "#ccbe00",
  /** #a68e17 */
  DARK_YELLOW = "#a68e17",

  // Greens
  /** #008000 */
  PURE_GREEN = "#008000",
  /** #78c850 */
  LIGHT_GREEN = "#78c850",

  // Blues
  /** #40c8f8 */
  LIGHT_BLUE = "#40c8f8",
  /** #6890f0 */
  SOFT_BLUE = "#6890f0",

  /** #3890f8 */
  GREAT = "#3890f8",
  /** #f8d038 */
  ULTRA = "#f8d038",
  /** #e020c0 */
  MASTER = "#e020c0",
  /** #e64a18 */
  LUXURY = "#e64a18",
}

export enum TypeColor {
  /** #ada594 */
  NORMAL = "#ada594",
  /** #a55239 */
  FIGHTING = "#a55239",
  /** #9cadf7 */
  FLYING = "#9cadf7",
  /** #9141cb */
  POISON = "#9141cb",
  /** #ae7a3b */
  GROUND = "#ae7a3b",
  /** #bda55a */
  ROCK = "#bda55a",
  /** #adbd21 */
  BUG = "#adbd21",
  /** #6363b5 */
  GHOST = "#6363b5",
  /** #81a6be */
  STEEL = "#81a6be",
  /** #f75231 */
  FIRE = "#f75231",
  /** #399cff */
  WATER = "#399cff",
  /** #7bce52 */
  GRASS = "#7bce52",
  /** #ffc631 */
  ELECTRIC = "#ffc631",
  /** #ef4179 */
  PSYCHIC = "#ef4179",
  /** #5acee7 */
  ICE = "#5acee7",
  /** #7b63e7 */
  DRAGON = "#7b63e7",
  /** #735a4a */
  DARK = "#735a4a",
  /** #ef70ef */
  FAIRY = "#ef70ef",
}

export enum TypeShadowColor {
  /** #574f4a */
  NORMAL = "#574f4a",
  /** #4e637c */
  FIGHTING = "#4e637c",
  /** #4e637c */
  FLYING = "#4e637c",
  /** #352166 */
  POISON = "#352166",
  /** #572d1e */
  GROUND = "#572d1e",
  /** #5f442d */
  ROCK = "#5f442d",
  /** #5f5010 */
  BUG = "#5f5010",
  /** #323d5b */
  GHOST = "#323d5b",
  /** #415c5f */
  STEEL = "#415c5f",
  /** #7c1818 */
  FIRE = "#7c1818",
  /** #1c4e80 */
  WATER = "#1c4e80",
  /** #4f6729 */
  GRASS = "#4f6729",
  /** #804618 */
  ELECTRIC = "#804618",
  /** #782155 */
  PSYCHIC = "#782155",
  /** #2d5c74 */
  ICE = "#2d5c74",
  /** #313874 */
  DRAGON = "#313874",
  /** #392725 */
  DARK = "#392725",
  /** #663878 */
  FAIRY = "#663878",
}

export enum ShadowColor {
  /** #d0d0c8 */
  LIGHT_GREY = "#d0d0c8",
  /** #636363 */
  GREY = "#636363",
  /** #707070 */
  MEDIUM_GRAY = "#707070",
  /** #807870 */
  DARK_GREY = "#807870",

  // Browns
  /** #69402a */
  LIGHT_BROWN = "#69402a",
  /** #632929 */
  DARK_BROWN = "#632929",
  /** #6e672c */
  OLIVE_BRONZE = "#6e672c",

  // Purples
  /** #483850 */
  DARK_PURPLE = "#483850",
  /** #6b5a73 */
  PURPLE = "#6b5a73",

  // Reds
  /** #fca2a2 */
  LIGHT_RED = "#fca2a2",
  /** #f83018 */
  BRIGHT_RED = "#f83018",
  /** #984038 */
  DEEP_RED = "#984038",
  /** #c03028 */
  DARK_RED = "#c03028",
  /** #906060 */
  DUSTY_ROSE = "#906060",

  // Greens
  /** #306850 */
  SOFT_GREEN = "#306850",
  /** #588040 */
  MUTED_GREEN = "#588040",

  // Blues
  /** #006090 */
  LIGHT_BLUE = "#006090",

  // Yellows and Oranges
  /** #ded6b5 */
  LIGHT_YELLOW = "#ded6b5",
  /** #ebd773 */
  YELLOW = "#ebd773",
  /** #a0a060 */
  DARK_YELLOW = "#a0a060",
  /** #b8a038 */
  MUTED_GOLD = "#b8a038",
  /** #c07800 */
  ORANGE = "#c07800",
  /** #ffbd73 */
  LIGHT_ORANGE = "#ffbd73",
  /** #f7b18b */
  PEACH_SAND = "#f7b18b",
}

export enum TypeEffectivenessColor {
  /** #929292 */
  NO_EFFECT = "#929292", // Grey (0x)

  /** #ff3500 */
  MAX_RESISTED = "#ff3500", // Mostly Red (0.0625x) - not possible?
  /** #ff5500 */
  VERY_RESISTED = "#ff5500", // Deep Orange (0.125x)
  /** #ff7400 */
  RESISTED = "#ff7400", // Bright Orange (0.25x)
  /** #fe8e00 */
  NOT_VERY_EFFECTIVE = "#fe8e00", // Warm Orange (0.5x)

  /** #4aa500 */
  SUPER_EFFECTIVE = "#4aa500", // Deep Green (2x)
  /** #4bb400 */
  DOUBLE_SUPER_EFFECTIVE = "#4bb400", // Green (4x)
  /** #52c200 */
  QUAD_SUPER_EFFECTIVE = "#52c200", // Bright Green (8x)
  /** #61e000 */
  MAX_SUPER_EFFECTIVE = "#61e000", // Vibrant Green (16x)
}
