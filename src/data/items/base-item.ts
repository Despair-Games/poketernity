import { type Item } from "#app/@types/item/Item";
import { type Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { type ItemCategory } from "#enums/item-category";
import { ItemId } from "#enums/item-id";
import { type ItemRarity } from "#enums/item-rarity";
import { type StatusEffect } from "#enums/status-effect";
import { t } from "i18next";

//#region Types

/** The initialization options for a {@linkcode BaseItem} instance */
export interface BaseItemInit extends Item {}

/** The context of a damage event */
export interface DamageReceivedContext {
  /** The amount of damage received */
  damage: number;
}

export interface StatusEffectAppliedContext {
  /** The {@linkcode Pokemon} that received the status effect */
  pokemon: Pokemon;
  /** The {@linkcode StatusEffect} that was applied */
  statusEffect: StatusEffect;
}

export interface TurnEndContext {}

export interface DefenseCalculationContext {
  /** The multiplier applied to the defense */
  multiplier: NumberHolder;
}

//#endregion

export abstract class BaseItem implements Item {
  public readonly id: ItemId;
  public readonly rarity: ItemRarity;
  public readonly category: ItemCategory;

  constructor({ id, rarity, category }: BaseItemInit) {
    this.id = id;
    this.rarity = rarity;
    this.category = category;
  }

  public get name(): string {
    return t(`item:${ItemId[this.id]}.name`);
  }

  public get description(): string {
    return t(`item:${ItemId[this.id]}.description`);
  }

  /**
   * Event handler for a pokemon having received damage
   * @param context The {@linkcode DamageReceivedContext}
   */
  public onDamageReceived?(context: DamageReceivedContext): void;

  /**
   * Event handler for a pokemon having a status effect applied
   * @param context The {@linkcode StatusEffectAppliedContext}
   */
  public onStatusEffectApplied?(context: StatusEffectAppliedContext): void;

  /**
   * Event handler for the end of a turn
   * @param context The {@linkcode TurnEndContext}
   */
  public onTurnEnd?(context: TurnEndContext): void;

  /**
   * Event handler for a pokemon's defense being calculated
   * @param context The {@linkcode DefenseCalculationContext}
   */
  public onDefenseCalulation?(context: DefenseCalculationContext): void;
}
