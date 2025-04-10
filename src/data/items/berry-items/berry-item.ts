import type { Edible } from "#app/@types/item/Edible";
import type { FlingContext, Holdable, TransferContext } from "#app/@types/item/Holdable";
import { BaseItem, type BaseItemInit } from "#app/data/items/base-item";
import type { Pokemon } from "#app/field/pokemon";
import { toDmgValue } from "#app/utils";
import { ItemCategory } from "#enums/item-category";

//#region Types

export interface BerryItemInit extends Omit<BaseItemInit, "category"> {
  readonly holder: Pokemon;
  readonly flingDamage: number;
  readonly isTransferable?: boolean;
  readonly isEffectPreventable?: boolean;
}

//#endregion

export abstract class BerryItem extends BaseItem implements Edible, Holdable {
  public readonly flingDamage: number;
  public readonly holder: Pokemon;
  public readonly isTransferable: boolean;
  public readonly isEffectPreventable: boolean;

  constructor({ id, rarity, holder, flingDamage, isTransferable = true, isEffectPreventable = true }: BerryItemInit) {
    super({ id, rarity, category: ItemCategory.BERRY });
    this.holder = holder;
    this.flingDamage = flingDamage;
    this.isTransferable = isTransferable;
    this.isEffectPreventable = isEffectPreventable;
  }

  //#region Event Handlers

  public onFling({ targetPokemon }: FlingContext): void {
    // this.holder.removeHeldItem(this); TODO: implement removing the held item/destroying the instance?
    targetPokemon.damageAndUpdate(toDmgValue(this.flingDamage));
  }

  public onTransfer(_context: TransferContext): void {
    if (this.isTransferable) {
      // this.holder.removeHeldItem(this); TODO: implement removing the held item/destroying the instance?
      // context.targetPokemon.addHeldItem(this); TODO: implement adding the held item
    }
  }

  public abstract onEat(): void;

  //#endregion;
}
