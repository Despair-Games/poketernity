import type { PlayerPokemon } from "#field/player-pokemon";
import type { PokemonLevelIncrementModifier } from "#modifier/modifier";
import type { FaintPhase } from "#phases/faint-phase";
import type { LevelUpPhase } from "#phases/level-up-phase";
import type { NextEncounterPhase } from "#phases/next-encounter-phase";

/** Each wave, all unfainted Pokemon gain this much happiness. Used in {@linkcode NextEncounterPhase} */
export const FRIENDSHIP_GAIN_PER_WAVE = 1;

/** Value for how much friendship a Pokemon gains on leveling up. Used in {@linkcode LevelUpPhase} */
export const FRIENDSHIP_GAIN_PER_LEVEL_UP = 10;

/** After this point, friendship gain is halved (rounded down). Used in {@linkcode PlayerPokemon.addFriendship} */
export const FRIENDSHIP_GAIN_CUTOFF = 150;

/** Additional friendship gained from rare candy. Used in {@linkcode PokemonLevelIncrementModifier} */
export const FRIENDSHIP_GAIN_FROM_CANDY = 5;

/** Penalty for losing friendship on faint. Used in {@linkcode FaintPhase} */
export const FRIENDSHIP_LOST_FROM_FAINTING = 10;
