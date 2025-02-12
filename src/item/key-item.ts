import i18next from "i18next";
import { BaseItem } from "./base-item";

/**
 * Key Items are items that are attached to the player
 */
export abstract class KeyItem extends BaseItem {
  public localeKey: string;
  public iconImage: string;

  constructor(localeKey: string, iconImage: string) {
    super();
    this.localeKey = localeKey;
    this.iconImage = iconImage;
  }

  override get name(): string {
    return i18next.t(`${this.localeKey}.name` as any);
  }

  override get description(): string {
    return i18next.t(`${this.localeKey}.description` as any);
  }
}
