import type { TurnMove } from "#app/@types/TurnMove";
import type { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { PokemonSpeciesForm } from "#app/data/pokemon-species-form";
import type { PokemonMove } from "#app/field/pokemon-move";
import { AbilityId } from "#enums/ability-id";
import type { ElementalType } from "#enums/elemental-type";
import type { Gender } from "#enums/gender";

export class PokemonSummonData {
  /** [Atk, Def, SpAtk, SpDef, Spd, Acc, Eva] */
  public statStages: number[] = [0, 0, 0, 0, 0, 0, 0];
  public moveQueue: TurnMove[] = [];
  public tags: BattlerTag[] = [];
  public abilitySuppressed: boolean = false;
  public abilitiesApplied: AbilityId[] = [];
  public speciesForm: PokemonSpeciesForm | null;
  public ability: AbilityId = AbilityId.NONE;
  public passiveAbility: AbilityId = AbilityId.NONE;
  public gender: Gender;
  public stats: number[] = [0, 0, 0, 0, 0, 0];
  public moveset: PokemonMove[];
  // If not initialized this value will not be populated from save data.
  public types: ElementalType[] = [];
  public addedType: ElementalType | null = null;
}
