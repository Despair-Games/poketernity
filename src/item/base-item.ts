import type { ModifierTier } from "#enums/modifier-tier";

export abstract class BaseItem {
  public nameKey: string;
  public descKey: string;
  public price: number;
  public rarity: ModifierTier; // TODO: Rename this
  public stackCount: number;
  public maxStackCount: number;
}
