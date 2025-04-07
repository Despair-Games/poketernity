import type { Eatable } from "#app/@types/item/Eatable";
import type { FlingContext, Holdable } from "#app/@types/item/Holdable";
import { BaseItem, type BaseItemInit } from "#app/data/items/base-item";
import type { Pokemon } from "#app/field/pokemon";
import { toDmgValue } from "#app/utils";
import { ItemCategory } from "#enums/item-category";

//#region Types

export interface BerryItemInit extends Omit<BaseItemInit, "category"> {
  readonly holder: Pokemon;
  readonly flingDamage: number;
}

//#endregion

export abstract class BerryItem extends BaseItem implements Eatable, Holdable {
  public readonly flingDamage: number;
  public readonly holder: Pokemon;

  constructor({ id, rarity, holder, flingDamage }: BerryItemInit) {
    super({ id, rarity, category: ItemCategory.BERRY });
    this.holder = holder;
    this.flingDamage = flingDamage;
  }

  public onFling({ targetPokemon }: FlingContext): void {
    // this.holder.removeHeldItem(this); TODO: implement removing the held item/destroying the instance?
    targetPokemon.damageAndUpdate(toDmgValue(this.flingDamage));
  }

  public abstract eat(): void;
}
