import type { PokemonSpecies } from "#data/pokemon-species";
import type { BattleCommand } from "#enums/battle-command";
import type { PartyOption } from "#enums/party-option";
import type { PlayerPokemon } from "#field/player-pokemon";
import type { PokemonMove } from "#field/pokemon-move";
import type { PokemonHeldItemModifier } from "#modifier/modifier";

export interface ShowTextOptions {
  /**
   * The delay in milliseconds before the text is displayed.
   * @defaultValue `20`
   */
  delay?: number;
  /** A callback function to execute after the text is done displaying. */
  callback?: VoidFunction;
  /**
   * The delay in milliseconds before executing the callback.
   * @defaultValue `0`
   */
  callbackDelay?: number;
  /**
   * Whether to display the prompt icon at the end of the textbox.
   * @defaultValue `false`
   */
  prompt?: boolean;
  /**
   * The delay in milliseconds before showing the prompt.
   * @defaultValue `0`
   */
  promptDelay?: number;
}

// #region Party UI

export type PartyModifierTransferSelectCallback = (
  fromCursor: number,
  index: number,
  itemQuantity?: number,
  toCursor?: number,
) => void;

export type PokemonModifierTransferSelectFilter = (
  pokemon: PlayerPokemon,
  modifier: PokemonHeldItemModifier,
) => string | null;

export type PartySelectCallback = (cursor: number, option: PartyOption) => void;

export type PokemonMoveSelectFilter = (pokemonMove: PokemonMove) => string | null;

export type PokemonSelectFilter = (pokemon: PlayerPokemon) => string | null;

export type PokemonSpeciesFilter = (species: PokemonSpecies) => boolean;

// #endregion

export type FightCommand = typeof BattleCommand.FIGHT | typeof BattleCommand.TERA;
