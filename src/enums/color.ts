export enum CommonColor {
  WHITE = "#ffffff",
  OFF_WHITE = "#f8f8f8",
  LIGHT_GREY = "#a0a0a0",
  GREY = "#484848",
  DARK_GREY = "#404040",

  // Reds & Pinks
  SOFT_PINK = "#f89890",
  CORAL_PINK = "#f88880",
  BRIGHT_PINK = "#f85888",
  PURE_RED = "#ff0000",
  WARM_RED = "#e13d3d",
  DEEP_RED = "#e70808",

  VIBRANT_PURPLE = "#a040a0",

  // Oranges & Yellows
  SOFT_ORANGE = "#f8b050",
  BRIGHT_ORANGE = "#f08030",
  DEEP_ORANGE = "#d64b00",
  GOLD_YELLOW = "#f8d030",
  MUTED_YELLOW = "#e8e8a8",
  DEEP_YELLOW = "#ccbe00",
  DARK_YELLOW = "#a68e17",

  // Greens
  LIGHT_GREEN = "#008000",
  PURE_GREEN = "#58d858",

  // Blues
  LIGHT_BLUE = "#40c8f8",
  SOFT_BLUE = "#6890f0",

  GREAT = "#3890f8",
  ULTRA = "#f8d038",
  MASTER = "#e020c0",
  LUXURY = "#e64a18",
}

export enum TypeColor {
  NORMAL = "#ada594",
  FIGHTING = "#a55239",
  FLYING = "#9cadf7",
  POISON = "#9141cb",
  GROUND = "#ae7a3b",
  ROCK = "#bda55a",
  BUG = "#adbd21",
  GHOST = "#6363b5",
  STEEL = "#81a6be",
  FIRE = "#f75231",
  WATER = "#399cff",
  GRASS = "#7bce52",
  ELECTRIC = "#ffc631",
  PSYCHIC = "#ef4179",
  ICE = "#5acee7",
  DRAGON = "#7b63e7",
  DARK = "#735a4a",
  FAIRY = "#ef70ef",
}

export enum TypeShadowColor {
  NORMAL = "#574f4a",
  FIGHTING = "#4e637c",
  FLYING = "#4e637c",
  POISON = "#352166",
  GROUND = "#572d1e",
  ROCK = "#5f442d",
  BUG = "#5f5010",
  GHOST = "#323d5b",
  STEEL = "#415c5f",
  FIRE = "#7c1818",
  WATER = "#1c4e80",
  GRASS = "#4f6729",
  ELECTRIC = "#804618",
  PSYCHIC = "#782155",
  ICE = "#2d5c74",
  DRAGON = "#313874",
  DARK = "#392725",
  FAIRY = "#663878",
}

export enum ShadowColor {
  LIGHT_GREY = "#d0d0c8",
  GREY = "#636363",
  MEDIUM_GRAY = "#707070",
  DARK_GREY = "#807870",

  // Browns
  LIGHT_BROWN = "#69402a",
  DARK_BROWN = "#632929",
  OLIVE_BRONZE = "#6e672c",

  // Purples
  DARK_PURPLE = "#483850",
  PURPLE = "#6b5a73",

  // Reds
  LIGHT_RED = "#fca2a2",
  BRIGHT_RED = "#f83018",
  DEEP_RED = "#984038",
  DARK_RED = "#c03028",
  DUSTY_ROSE = "#906060",

  // Greens
  SOFT_GREEN = "#306850",
  MUTED_GREEN = "#588040",

  // Blues
  LIGHT_BLUE = "#006090",

  // Yellows and Oranges
  LIGHT_YELLOW = "#ded6b5",
  YELLOW = "#ebd773",
  DARK_YELLOW = "#a0a060",
  MUTED_GOLD = "#b8a038",
  ORANGE = "#c07800",
  LIGHT_ORANGE = "#ffbd73",
  PEACH_SAND = "#f7b18b",
}

export enum TypeEffectivenessColor {
  NO_EFFECT = "#929292", // Grey (0x)

  VERY_RESISTED = "#ff5500", // Deep Orange (0.125x)
  RESISTED = "#ff7400", // Bright Orange (0.25x)
  NOT_VERY_EFFECTIVE = "#fe8e00", // Warm Orange (0.5x)

  SUPER_EFFECTIVE = "#4aa500", // Deep Green (2x)
  VERY_SUPER_EFFECTIVE = "#4bb400", // Brighter Green (4x)
  MAX_SUPER_EFFECTIVE = "#52c200", // Most vibrant Green (8x)

  DEFENSE_NO_EFFECT = "#b1b100", // Mustard Yellow (0x)
  DEFENSE_VERY_RESISTED = "#2db4ff", // Light Blue (0.125x)
  DEFENSE_RESISTED = "#00a4ff", // Brighter Blue (0.25x)
  DEFENSE_NOT_VERY_EFFECTIVE = "#0093ff", // Deep Blue (0.5x)
}
