import { BerryType } from "#enums/berry-type";
import { t } from "i18next";

export function getBerryName(berryType: BerryType): string {
  return t(`berry:${BerryType[berryType]}.name`);
}

export function getBerryEffectDescription(berryType: BerryType): string {
  return t(`berry:${BerryType[berryType]}.effect`);
}
