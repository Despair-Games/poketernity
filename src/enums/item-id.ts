// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import { type ItemCategory } from "#enums/item-category";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

/**
 * The IDs of every item.
 *
 * **Note**: The order of these items should match the order of the {@linkcode ItemCategory} enum
 */
export enum ItemId {
  INVALID,
  // Key Items
  MAP = 100,
  // Meds
  POTION = 200,
  SUPER_POTION,
  HYPER_POTION,
  MAX_POTION,
  // Balls
  POKE_BALL = 300,
  GREAT_BALL,
  ULTRA_BALL,
  MASTER_BALL,
  // Berries
  SITRUS_BERRY = 400,
  CHERI_BERRY,
  // TMs/HMs
}
