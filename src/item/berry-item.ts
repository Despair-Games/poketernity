import type { ElementalType } from "#enums/elemental-type";
import type { BattleStat } from "#enums/stat";
import type { StatusEffect } from "#enums/status-effect";
import { HeldItem } from "./held-item";

export abstract class BerryItem extends HeldItem {
  public healPercent: number;
  public cureStatus: StatusEffect;
  public boostStat: BattleStat;
  public naturalGiftPower: number;
  public naturalGiftType: ElementalType;
}
