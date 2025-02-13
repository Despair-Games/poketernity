import { TypeEffectivenessColor } from "#enums/color";
import { ElementalType } from "#enums/elemental-type";

export type TypeDamageMultiplier = 0 | 0.125 | 0.25 | 0.5 | 1 | 2 | 4 | 8 | 16;

export function getTypeDamageMultiplier(attackType: ElementalType, defType: ElementalType): TypeDamageMultiplier {
  if (attackType === ElementalType.UNKNOWN || defType === ElementalType.UNKNOWN) {
    return 1;
  }

  switch (defType) {
    case ElementalType.NORMAL:
      switch (attackType) {
        case ElementalType.FIGHTING:
          return 2;
        case ElementalType.GHOST:
          return 0;
        default:
          return 1;
      }
    case ElementalType.FIGHTING:
      switch (attackType) {
        case ElementalType.FLYING:
        case ElementalType.PSYCHIC:
        case ElementalType.FAIRY:
          return 2;
        case ElementalType.ROCK:
        case ElementalType.BUG:
        case ElementalType.DARK:
          return 0.5;
        default:
          return 1;
      }
    case ElementalType.FLYING:
      switch (attackType) {
        case ElementalType.ROCK:
        case ElementalType.ELECTRIC:
        case ElementalType.ICE:
          return 2;
        case ElementalType.FIGHTING:
        case ElementalType.BUG:
        case ElementalType.GRASS:
          return 0.5;
        case ElementalType.GROUND:
          return 0;
        default:
          return 1;
      }
    case ElementalType.POISON:
      switch (attackType) {
        case ElementalType.GROUND:
        case ElementalType.PSYCHIC:
          return 2;
        case ElementalType.FIGHTING:
        case ElementalType.POISON:
        case ElementalType.BUG:
        case ElementalType.GRASS:
        case ElementalType.FAIRY:
          return 0.5;
        default:
          return 1;
      }
    case ElementalType.GROUND:
      switch (attackType) {
        case ElementalType.WATER:
        case ElementalType.GRASS:
        case ElementalType.ICE:
          return 2;
        case ElementalType.POISON:
        case ElementalType.ROCK:
          return 0.5;
        case ElementalType.ELECTRIC:
          return 0;
        default:
          return 1;
      }
    case ElementalType.ROCK:
      switch (attackType) {
        case ElementalType.FIGHTING:
        case ElementalType.GROUND:
        case ElementalType.STEEL:
        case ElementalType.WATER:
        case ElementalType.GRASS:
          return 2;
        case ElementalType.NORMAL:
        case ElementalType.FLYING:
        case ElementalType.POISON:
        case ElementalType.FIRE:
          return 0.5;
        default:
          return 1;
      }
    case ElementalType.BUG:
      switch (attackType) {
        case ElementalType.FLYING:
        case ElementalType.ROCK:
        case ElementalType.FIRE:
          return 2;
        case ElementalType.FIGHTING:
        case ElementalType.GROUND:
        case ElementalType.GRASS:
          return 0.5;
        default:
          return 1;
      }
    case ElementalType.GHOST:
      switch (attackType) {
        case ElementalType.GHOST:
        case ElementalType.DARK:
          return 2;
        case ElementalType.POISON:
        case ElementalType.BUG:
          return 0.5;
        case ElementalType.NORMAL:
        case ElementalType.FIGHTING:
          return 0;
        default:
          return 1;
      }
    case ElementalType.STEEL:
      switch (attackType) {
        case ElementalType.FIGHTING:
        case ElementalType.GROUND:
        case ElementalType.FIRE:
          return 2;
        case ElementalType.NORMAL:
        case ElementalType.FLYING:
        case ElementalType.ROCK:
        case ElementalType.BUG:
        case ElementalType.STEEL:
        case ElementalType.GRASS:
        case ElementalType.PSYCHIC:
        case ElementalType.ICE:
        case ElementalType.DRAGON:
        case ElementalType.FAIRY:
          return 0.5;
        case ElementalType.POISON:
          return 0;
        default:
          return 1;
      }
    case ElementalType.FIRE:
      switch (attackType) {
        case ElementalType.GROUND:
        case ElementalType.ROCK:
        case ElementalType.WATER:
          return 2;
        case ElementalType.BUG:
        case ElementalType.STEEL:
        case ElementalType.FIRE:
        case ElementalType.GRASS:
        case ElementalType.ICE:
        case ElementalType.FAIRY:
          return 0.5;
        default:
          return 1;
      }
    case ElementalType.WATER:
      switch (attackType) {
        case ElementalType.GRASS:
        case ElementalType.ELECTRIC:
          return 2;
        case ElementalType.STEEL:
        case ElementalType.FIRE:
        case ElementalType.WATER:
        case ElementalType.ICE:
          return 0.5;
        default:
          return 1;
      }
    case ElementalType.GRASS:
      switch (attackType) {
        case ElementalType.FLYING:
        case ElementalType.POISON:
        case ElementalType.BUG:
        case ElementalType.FIRE:
        case ElementalType.ICE:
          return 2;
        case ElementalType.GROUND:
        case ElementalType.WATER:
        case ElementalType.GRASS:
        case ElementalType.ELECTRIC:
          return 0.5;
        default:
          return 1;
      }
    case ElementalType.ELECTRIC:
      switch (attackType) {
        case ElementalType.GROUND:
          return 2;
        case ElementalType.FLYING:
        case ElementalType.STEEL:
        case ElementalType.ELECTRIC:
          return 0.5;
        default:
          return 1;
      }
    case ElementalType.PSYCHIC:
      switch (attackType) {
        case ElementalType.BUG:
        case ElementalType.GHOST:
        case ElementalType.DARK:
          return 2;
        case ElementalType.FIGHTING:
        case ElementalType.PSYCHIC:
          return 0.5;
        default:
          return 1;
      }
    case ElementalType.ICE:
      switch (attackType) {
        case ElementalType.FIGHTING:
        case ElementalType.ROCK:
        case ElementalType.STEEL:
        case ElementalType.FIRE:
          return 2;
        case ElementalType.ICE:
          return 0.5;
        default:
          return 1;
      }
    case ElementalType.DRAGON:
      switch (attackType) {
        case ElementalType.ICE:
        case ElementalType.DRAGON:
        case ElementalType.FAIRY:
          return 2;
        case ElementalType.FIRE:
        case ElementalType.WATER:
        case ElementalType.GRASS:
        case ElementalType.ELECTRIC:
          return 0.5;
        default:
          return 1;
      }
    case ElementalType.DARK:
      switch (attackType) {
        case ElementalType.FIGHTING:
        case ElementalType.BUG:
        case ElementalType.FAIRY:
          return 2;
        case ElementalType.GHOST:
        case ElementalType.DARK:
          return 0.5;
        case ElementalType.PSYCHIC:
          return 0;
        default:
          return 1;
      }
    case ElementalType.FAIRY:
      switch (attackType) {
        case ElementalType.POISON:
        case ElementalType.STEEL:
          return 2;
        case ElementalType.FIGHTING:
        case ElementalType.BUG:
        case ElementalType.DARK:
          return 0.5;
        case ElementalType.DRAGON:
          return 0;
        default:
          return 1;
      }
    case ElementalType.STELLAR:
      return 1;
  }

  return 1;
}

/**
 * Retrieve the color corresponding to a specific damage multiplier
 * @returns A color or undefined if the default color should be used
 */
export function getTypeDamageMultiplierColor(multiplier: TypeDamageMultiplier): string | undefined {
  const effectivenessMap: Record<TypeDamageMultiplier, string | undefined> = {
    0: TypeEffectivenessColor.NO_EFFECT,
    0.125: TypeEffectivenessColor.VERY_RESISTED,
    0.25: TypeEffectivenessColor.RESISTED,
    0.5: TypeEffectivenessColor.NOT_VERY_EFFECTIVE,
    1: undefined,
    2: TypeEffectivenessColor.SUPER_EFFECTIVE,
    4: TypeEffectivenessColor.DOUBLE_SUPER_EFFECTIVE,
    8: TypeEffectivenessColor.QUAD_SUPER_EFFECTIVE,
    16: TypeEffectivenessColor.MAX_SUPER_EFFECTIVE,
  };

  return effectivenessMap[multiplier];
}

/** @todo Normalize all RGB/Hexcode colors to the same system */
export function getTypeRgb(type: ElementalType): [number, number, number] {
  switch (type) {
    case ElementalType.NORMAL:
      return [168, 168, 120];
    case ElementalType.FIGHTING:
      return [192, 48, 40];
    case ElementalType.FLYING:
      return [168, 144, 240];
    case ElementalType.POISON:
      return [160, 64, 160];
    case ElementalType.GROUND:
      return [224, 192, 104];
    case ElementalType.ROCK:
      return [184, 160, 56];
    case ElementalType.BUG:
      return [168, 184, 32];
    case ElementalType.GHOST:
      return [112, 88, 152];
    case ElementalType.STEEL:
      return [184, 184, 208];
    case ElementalType.FIRE:
      return [240, 128, 48];
    case ElementalType.WATER:
      return [104, 144, 240];
    case ElementalType.GRASS:
      return [120, 200, 80];
    case ElementalType.ELECTRIC:
      return [248, 208, 48];
    case ElementalType.PSYCHIC:
      return [248, 88, 136];
    case ElementalType.ICE:
      return [152, 216, 216];
    case ElementalType.DRAGON:
      return [112, 56, 248];
    case ElementalType.DARK:
      return [112, 88, 72];
    case ElementalType.FAIRY:
      return [232, 136, 200];
    case ElementalType.STELLAR:
      return [255, 255, 255];
    default:
      return [0, 0, 0];
  }
}
