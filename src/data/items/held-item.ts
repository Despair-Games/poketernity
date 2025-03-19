import type { ElementalType } from "#enums/elemental-type";
import { BaseItem } from "./base-item";

/**
 * Held items are items that are held onto by Pokemon
 */
export abstract class HeldItem extends BaseItem {
  public readonly isTransferable: boolean;
  public readonly isIgnorable: boolean;

  getFlingDamage(): number {
    return 0;
  }

  getFlingEffect(): void {}
}

export abstract class FormChangeHeldItem extends HeldItem {}

/**
 * For beries which are held by Pokemon and consumed
 */
export abstract class BerryItem extends HeldItem {
  public naturalGiftPower: number;
  public naturalGiftType: ElementalType;

  getBerryEatenEffect(): void {}
}
