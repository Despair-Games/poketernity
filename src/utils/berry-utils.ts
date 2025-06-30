import { BerryType } from "#enums/berry-type";
import { enumValueToKey } from "#utils/common-utils";
import { t } from "i18next";

export function getBerryName(berryType: BerryType): string {
  return t(`berry:${enumValueToKey(BerryType, berryType)}.name`);
}

export function getBerryEffectDescription(berryType: BerryType): string {
  return t(`berry:${enumValueToKey(BerryType, berryType)}.effect`);
}
