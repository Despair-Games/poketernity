/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import type { TurnCommand } from "#app/turn-command-manager";
import type { BattlerTag } from "#battler-tags/battler-tag";
import type { PokemonSpeciesForm } from "#data/pokemon-species-form";
import type { TypeDamageMultiplier } from "#data/type";
import type { AbilityId } from "#enums/ability-id";
import type { BerryType } from "#enums/berry-type";
import type { ElementalType } from "#enums/elemental-type";
import type { Gender } from "#enums/gender";
import type { StatusEffect } from "#enums/status-effect";
import type { PokemonMove } from "#field/pokemon-move";
import type { AttackMoveResult, TurnMove } from "#types/move-types";

/**
 * Data that resets whenever a Pokemon is switched out.
 *
 * Currently all fields in {@linkcode Pokemon.summonData} are stored in save data.
 * @todo Rework save data to be more efficient
 */
export interface PokemonSummonData {
  /** `[Atk, Def, SpAtk, SpDef, Spd, Acc, Eva]` */
  statStages: number[];
  moveQueue: TurnMove[];
  /** {@linkcode BattlerTag}s attached to the pokemon */
  tags: BattlerTag[];
  /** Whether the pokemon's abilities are being suppressed by a move like {@linkcode MoveId.GASTRO_ACID | Gastro Acid} */
  abilitySuppressed: boolean;
  /** List of abilities that have been activated */
  abilitiesApplied: AbilityId[];
  /** The {@linkcode PokemonSpeciesForm | species} this pokemon has transformed into */
  speciesForm: PokemonSpeciesForm | null;
  ability: AbilityId;
  passiveAbility: AbilityId;
  gender: Gender | null;
  /** `[Hp, Atk, Def, SpAtk, SpDef, Spd]` */
  stats: number[];
  moveset: PokemonMove[];
  types: ElementalType[];
  /** Type added from {@linkcode MoveId.FORESTS_CURSE | Forest's Curse} or {@linkcode MoveId.TRICK_OR_TREAT | Trick-or-Treat} */
  addedType: ElementalType | null;
  /** The number of turns the pokemon has passed since entering the field */
  turnCount: number;
  /**
   * The number of turns the pokemon has passed since the start of the wave.
   * @todo Remove this
   */
  waveTurnCount: number;
  /** The list of moves the pokemon has used since entering the field */
  moveHistory: TurnMove[];
}

export interface PokemonTurnData {
  turnCommand?: TurnCommand;
  flinched: boolean;
  acted: boolean;
  /** How many times the move should hit the target(s) */
  hitCount: number;
  /**
   * - `-1` = Calculate how many hits are left
   * - `0` = Move is finished
   */
  hitsLeft: number;
  totalDamageDealt: number;
  singleHitDamageDealt: number;
  damageTaken: number;
  attacksReceived: AttackMoveResult[];
  order: number;
  statStagesIncreased: boolean;
  statStagesDecreased: boolean;
  moveEffectiveness: TypeDamageMultiplier | null;
  combiningPledge?: MoveId;
  switchedInThisTurn: boolean;
  failedRunAway: boolean;
  joinedRound: boolean;
}

/** Container for Pokemon-specific data that resets at the end of each wave. */
export interface PokemonWaveData {
  /** How many hits the Pokemon has taken */
  hitCount: number;
  /** The berries eaten by the Pokemon */
  berriesEaten: BerryType[];
  /** The abilities this Pokemon has applied */
  abilitiesApplied: AbilityId[];
  /**
   * The abilities revealed from this Pokemon.
   * This differs from {@linkcode abilitiesApplied} in that
   * effects such as Frisk and Trace can reveal abilities
   * without applying them.
   */
  abilitiesRevealed: AbilityId[];
}

/** Contains fields related to {@linkcode StatusEffect}s */
export interface Status {
  /** @see {@linkcode StatusEffect} */
  readonly effect: StatusEffect;
  /**
   * Toxic damage is `1/16 max HP * toxicTurnCount`; increases by 1 per turn.
   * Ignored if the effect is not {@linkcode StatusEffect.TOXIC}
   * @defaultValue 0
   */
  toxicTurnCount: number;
  /**
   * The pokemon wakes up when this is `0` and the {@linkcode effect} is {@linkcode StatusEffect.SLEEP}.
   * Ignored if the effect is not sleep.
   * @defaultValue 0
   */
  sleepTurnsRemaining: number;
}
