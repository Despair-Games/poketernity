import { Nature } from "#enums/nature";
import { EFFECTIVE_STATS, type EffectiveStat, Stat } from "#enums/stat";
import { TextStyle } from "#enums/text-style";
import { getBBCodeFragment } from "#ui/text-utils";
import { enumValueToKey } from "#utils/common-utils";
import { getShortenedStatKey } from "#utils/i18n-utils";
import { toReadableString } from "#utils/string-utils";
import i18next from "i18next";

export function getNatureName(
  nature: Nature,
  includeStatEffects: boolean = false,
  singleLine: boolean = false,
  ignoreBBCode: boolean = false,
  baseTextStyle: TextStyle = TextStyle.WINDOW,
): string {
  let ret: string = i18next.t("nature:" + toReadableString(enumValueToKey(Nature, nature)));
  if (includeStatEffects) {
    let increasedStat: Stat | null = null;
    let decreasedStat: Stat | null = null;
    for (const stat of EFFECTIVE_STATS) {
      const multiplier = getNatureStatMultiplier(nature, stat);
      if (multiplier > 1) {
        increasedStat = stat;
      } else if (multiplier < 1) {
        decreasedStat = stat;
      }
    }

    const getTextFrag = ignoreBBCode
      ? (text: string, _style: TextStyle) => text
      : (text: string, style: TextStyle) => getBBCodeFragment(text, style, true);

    if (increasedStat != null && decreasedStat != null) {
      ret =
        // biome-ignore lint/complexity/noUselessStringConcat: intentional for improved readability
        `${ret}${singleLine ? " " : "\n"}`
        + `(${getTextFrag(`+${i18next.t(getShortenedStatKey(increasedStat))}`, TextStyle.SUMMARY_PINK)}`
        + `/${getTextFrag(`-${i18next.t(getShortenedStatKey(decreasedStat))}`, TextStyle.SUMMARY_BLUE)})`;
      ret = getTextFrag(ret, baseTextStyle);
    } else {
      ret = getTextFrag(`${ret}${singleLine ? " " : "\n"}(-)`, baseTextStyle);
    }
  }
  return ret;
}

export function getNatureStatMultiplier(nature: Nature, stat: EffectiveStat): number {
  switch (stat) {
    case Stat.ATK:
      switch (nature) {
        case Nature.LONELY:
        case Nature.BRAVE:
        case Nature.ADAMANT:
        case Nature.NAUGHTY:
          return 1.1;
        case Nature.BOLD:
        case Nature.TIMID:
        case Nature.MODEST:
        case Nature.CALM:
          return 0.9;
      }
      break;
    case Stat.DEF:
      switch (nature) {
        case Nature.BOLD:
        case Nature.RELAXED:
        case Nature.IMPISH:
        case Nature.LAX:
          return 1.1;
        case Nature.LONELY:
        case Nature.HASTY:
        case Nature.MILD:
        case Nature.GENTLE:
          return 0.9;
      }
      break;
    case Stat.SPATK:
      switch (nature) {
        case Nature.MODEST:
        case Nature.MILD:
        case Nature.QUIET:
        case Nature.RASH:
          return 1.1;
        case Nature.ADAMANT:
        case Nature.IMPISH:
        case Nature.JOLLY:
        case Nature.CAREFUL:
          return 0.9;
      }
      break;
    case Stat.SPDEF:
      switch (nature) {
        case Nature.CALM:
        case Nature.GENTLE:
        case Nature.SASSY:
        case Nature.CAREFUL:
          return 1.1;
        case Nature.NAUGHTY:
        case Nature.LAX:
        case Nature.NAIVE:
        case Nature.RASH:
          return 0.9;
      }
      break;
    case Stat.SPD:
      switch (nature) {
        case Nature.TIMID:
        case Nature.HASTY:
        case Nature.JOLLY:
        case Nature.NAIVE:
          return 1.1;
        case Nature.BRAVE:
        case Nature.RELAXED:
        case Nature.QUIET:
        case Nature.SASSY:
          return 0.9;
      }
      break;
  }

  return 1;
}
