import type { ModifierTier } from "#enums/modifier-tier";

interface SelectOption {
  nameKey: string;
  descKey: string;
  price: number;
  rarity: ModifierTier; // TODO: Rename this
}

export abstract class BaseItem implements SelectOption {
  nameKey: string;
  descKey: string;
  price: number;
  rarity: ModifierTier;
  public stackCount: number;
  public maxStackCount: number;
}
