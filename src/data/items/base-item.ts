import type { ModifierTier } from "#enums/modifier-tier";

interface SelectOption {
  readonly price: number;
  readonly rarity: ModifierTier; // TODO: Rename this

  get name(): string;
  get description(): string;
}

export abstract class BaseItem implements SelectOption {
  readonly price: number;
  readonly rarity: ModifierTier;
  public readonly stackCount: number;
  public readonly maxStackCount: number;

  get name(): string {
    throw new Error("Method not implemented.");
  }
  get description(): string {
    throw new Error("Method not implemented.");
  }
}
