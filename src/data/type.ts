import { ElementType } from "#enums/element-type";

export type TypeDamageMultiplier = 0 | 0.125 | 0.25 | 0.5 | 1 | 2 | 4 | 8;

export function getTypeDamageMultiplier(attackType: ElementType, defType: ElementType): TypeDamageMultiplier {
  if (attackType === ElementType.UNKNOWN || defType === ElementType.UNKNOWN) {
    return 1;
  }

  switch (defType) {
    case ElementType.NORMAL:
      switch (attackType) {
        case ElementType.FIGHTING:
          return 2;
        case ElementType.GHOST:
          return 0;
        default:
          return 1;
      }
    case ElementType.FIGHTING:
      switch (attackType) {
        case ElementType.FLYING:
        case ElementType.PSYCHIC:
        case ElementType.FAIRY:
          return 2;
        case ElementType.ROCK:
        case ElementType.BUG:
        case ElementType.DARK:
          return 0.5;
        default:
          return 1;
      }
    case ElementType.FLYING:
      switch (attackType) {
        case ElementType.ROCK:
        case ElementType.ELECTRIC:
        case ElementType.ICE:
          return 2;
        case ElementType.FIGHTING:
        case ElementType.BUG:
        case ElementType.GRASS:
          return 0.5;
        case ElementType.GROUND:
          return 0;
        default:
          return 1;
      }
    case ElementType.POISON:
      switch (attackType) {
        case ElementType.GROUND:
        case ElementType.PSYCHIC:
          return 2;
        case ElementType.FIGHTING:
        case ElementType.POISON:
        case ElementType.BUG:
        case ElementType.GRASS:
        case ElementType.FAIRY:
          return 0.5;
        default:
          return 1;
      }
    case ElementType.GROUND:
      switch (attackType) {
        case ElementType.WATER:
        case ElementType.GRASS:
        case ElementType.ICE:
          return 2;
        case ElementType.POISON:
        case ElementType.ROCK:
          return 0.5;
        case ElementType.ELECTRIC:
          return 0;
        default:
          return 1;
      }
    case ElementType.ROCK:
      switch (attackType) {
        case ElementType.FIGHTING:
        case ElementType.GROUND:
        case ElementType.STEEL:
        case ElementType.WATER:
        case ElementType.GRASS:
          return 2;
        case ElementType.NORMAL:
        case ElementType.FLYING:
        case ElementType.POISON:
        case ElementType.FIRE:
          return 0.5;
        default:
          return 1;
      }
    case ElementType.BUG:
      switch (attackType) {
        case ElementType.FLYING:
        case ElementType.ROCK:
        case ElementType.FIRE:
          return 2;
        case ElementType.FIGHTING:
        case ElementType.GROUND:
        case ElementType.GRASS:
          return 0.5;
        default:
          return 1;
      }
    case ElementType.GHOST:
      switch (attackType) {
        case ElementType.GHOST:
        case ElementType.DARK:
          return 2;
        case ElementType.POISON:
        case ElementType.BUG:
          return 0.5;
        case ElementType.NORMAL:
        case ElementType.FIGHTING:
          return 0;
        default:
          return 1;
      }
    case ElementType.STEEL:
      switch (attackType) {
        case ElementType.FIGHTING:
        case ElementType.GROUND:
        case ElementType.FIRE:
          return 2;
        case ElementType.NORMAL:
        case ElementType.FLYING:
        case ElementType.ROCK:
        case ElementType.BUG:
        case ElementType.STEEL:
        case ElementType.GRASS:
        case ElementType.PSYCHIC:
        case ElementType.ICE:
        case ElementType.DRAGON:
        case ElementType.FAIRY:
          return 0.5;
        case ElementType.POISON:
          return 0;
        default:
          return 1;
      }
    case ElementType.FIRE:
      switch (attackType) {
        case ElementType.GROUND:
        case ElementType.ROCK:
        case ElementType.WATER:
          return 2;
        case ElementType.BUG:
        case ElementType.STEEL:
        case ElementType.FIRE:
        case ElementType.GRASS:
        case ElementType.ICE:
        case ElementType.FAIRY:
          return 0.5;
        default:
          return 1;
      }
    case ElementType.WATER:
      switch (attackType) {
        case ElementType.GRASS:
        case ElementType.ELECTRIC:
          return 2;
        case ElementType.STEEL:
        case ElementType.FIRE:
        case ElementType.WATER:
        case ElementType.ICE:
          return 0.5;
        default:
          return 1;
      }
    case ElementType.GRASS:
      switch (attackType) {
        case ElementType.FLYING:
        case ElementType.POISON:
        case ElementType.BUG:
        case ElementType.FIRE:
        case ElementType.ICE:
          return 2;
        case ElementType.GROUND:
        case ElementType.WATER:
        case ElementType.GRASS:
        case ElementType.ELECTRIC:
          return 0.5;
        default:
          return 1;
      }
    case ElementType.ELECTRIC:
      switch (attackType) {
        case ElementType.GROUND:
          return 2;
        case ElementType.FLYING:
        case ElementType.STEEL:
        case ElementType.ELECTRIC:
          return 0.5;
        default:
          return 1;
      }
    case ElementType.PSYCHIC:
      switch (attackType) {
        case ElementType.BUG:
        case ElementType.GHOST:
        case ElementType.DARK:
          return 2;
        case ElementType.FIGHTING:
        case ElementType.PSYCHIC:
          return 0.5;
        default:
          return 1;
      }
    case ElementType.ICE:
      switch (attackType) {
        case ElementType.FIGHTING:
        case ElementType.ROCK:
        case ElementType.STEEL:
        case ElementType.FIRE:
          return 2;
        case ElementType.ICE:
          return 0.5;
        default:
          return 1;
      }
    case ElementType.DRAGON:
      switch (attackType) {
        case ElementType.ICE:
        case ElementType.DRAGON:
        case ElementType.FAIRY:
          return 2;
        case ElementType.FIRE:
        case ElementType.WATER:
        case ElementType.GRASS:
        case ElementType.ELECTRIC:
          return 0.5;
        default:
          return 1;
      }
    case ElementType.DARK:
      switch (attackType) {
        case ElementType.FIGHTING:
        case ElementType.BUG:
        case ElementType.FAIRY:
          return 2;
        case ElementType.GHOST:
        case ElementType.DARK:
          return 0.5;
        case ElementType.PSYCHIC:
          return 0;
        default:
          return 1;
      }
    case ElementType.FAIRY:
      switch (attackType) {
        case ElementType.POISON:
        case ElementType.STEEL:
          return 2;
        case ElementType.FIGHTING:
        case ElementType.BUG:
        case ElementType.DARK:
          return 0.5;
        case ElementType.DRAGON:
          return 0;
        default:
          return 1;
      }
    case ElementType.STELLAR:
      return 1;
  }

  return 1;
}

/**
 * Retrieve the color corresponding to a specific damage multiplier
 * @returns A color or undefined if the default color should be used
 */
export function getTypeDamageMultiplierColor(
  multiplier: TypeDamageMultiplier,
  side: "defense" | "offense",
): string | undefined {
  if (side === "offense") {
    switch (multiplier) {
      case 0:
        return "#929292";
      case 0.125:
        return "#FF5500";
      case 0.25:
        return "#FF7400";
      case 0.5:
        return "#FE8E00";
      case 1:
        return undefined;
      case 2:
        return "#4AA500";
      case 4:
        return "#4BB400";
      case 8:
        return "#52C200";
    }
  } else if (side === "defense") {
    switch (multiplier) {
      case 0:
        return "#B1B100";
      case 0.125:
        return "#2DB4FF";
      case 0.25:
        return "#00A4FF";
      case 0.5:
        return "#0093FF";
      case 1:
        return undefined;
      case 2:
        return "#FE8E00";
      case 4:
        return "#FF7400";
      case 8:
        return "#FF5500";
    }
  }
}

export function getTypeRgb(type: ElementType): [number, number, number] {
  switch (type) {
    case ElementType.NORMAL:
      return [168, 168, 120];
    case ElementType.FIGHTING:
      return [192, 48, 40];
    case ElementType.FLYING:
      return [168, 144, 240];
    case ElementType.POISON:
      return [160, 64, 160];
    case ElementType.GROUND:
      return [224, 192, 104];
    case ElementType.ROCK:
      return [184, 160, 56];
    case ElementType.BUG:
      return [168, 184, 32];
    case ElementType.GHOST:
      return [112, 88, 152];
    case ElementType.STEEL:
      return [184, 184, 208];
    case ElementType.FIRE:
      return [240, 128, 48];
    case ElementType.WATER:
      return [104, 144, 240];
    case ElementType.GRASS:
      return [120, 200, 80];
    case ElementType.ELECTRIC:
      return [248, 208, 48];
    case ElementType.PSYCHIC:
      return [248, 88, 136];
    case ElementType.ICE:
      return [152, 216, 216];
    case ElementType.DRAGON:
      return [112, 56, 248];
    case ElementType.DARK:
      return [112, 88, 72];
    case ElementType.FAIRY:
      return [232, 136, 200];
    case ElementType.STELLAR:
      return [255, 255, 255];
    default:
      return [0, 0, 0];
  }
}
