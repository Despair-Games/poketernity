import type { Consumable, ConsumeContext } from "#app/@types/item/Consumable";
import type { FlingContext, Holdable } from "#app/@types/item/Holdable";
import { BaseItem } from "#app/data/items/base-item";

export abstract class BerryItem extends BaseItem implements Holdable, Consumable {
  readonly isTransferable: boolean;
  readonly isIgnorable: boolean;

  abstract onConsume({ pokemon }: ConsumeContext): void;
  abstract onFling({ targetPokemon }: FlingContext): void;
}
