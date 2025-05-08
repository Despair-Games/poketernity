// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Pokemon } from "#field/pokemon";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports

import type { BattlerTag } from "#battler-tags/battler-tag";
import type { PokemonSpeciesForm } from "#data/pokemon-species-form";
import type { AbilityId } from "#enums/ability-id";
import type { ElementalType } from "#enums/elemental-type";
import type { Gender } from "#enums/gender";
import type { PokemonMove } from "#field/pokemon-move";
import type { TurnMove } from "#types/TurnMove";

/**
 * Data that resets whenever a Pokemon is switched out.
 *
 * Currently all fields in {@linkcode Pokemon.summonData} are stored in save data.
 * @todo Rework save data to be more efficient
 */
export interface PokemonSummonData {
  /**
   * `[Atk, Def, SpAtk, SpDef, Spd, Acc, Eva]`
   * @todo Change this to an object (e.g. `statStages.atk` etc)?
   */
  statStages: number[];
  moveQueue: TurnMove[];
  tags: BattlerTag[];
  abilitySuppressed: boolean;
  abilitiesApplied: AbilityId[];
  speciesForm: PokemonSpeciesForm | null;
  ability: AbilityId;
  passiveAbility: AbilityId;
  gender: Gender | null;
  /**
   * `[Hp, Atk, Def, SpAtk, SpDef, Spd]`
   * @todo Change this to an object (e.g. `stats.atk` etc)?
   */
  stats: number[];
  moveset: PokemonMove[];
  // If not initialized this value will not be populated from save data.
  types: ElementalType[];
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
