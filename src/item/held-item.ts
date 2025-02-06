import { BaseItem } from "./base-item";

export abstract class HeldItem extends BaseItem {
  public flingDamage: number;
  public flingEffect: null; // TODO: fill this out later
  public drive: boolean; // TODO: replace with enum representing drive
  public memory: boolean; // TODO: replace with enum representing memory
  public megaStone: boolean; // TODO: replace with enum representing the mega stone
  public ignoreKlutz: boolean;
}
