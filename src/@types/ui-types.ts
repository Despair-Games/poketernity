import type PokemonSpecies from "#data/pokemon-species";
import type { BattleCommand } from "#enums/battle-command";
import type { PartyOption } from "#enums/party-option";
import type { PlayerPokemon } from "#field/player-pokemon";
import type { PokemonMove } from "#field/pokemon-move";
import type { PokemonHeldItemModifier } from "#modifier/modifier";

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
