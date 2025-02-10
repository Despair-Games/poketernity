import type { BattlerTag } from "#app/data/battler-tags";
import type { PokemonSpeciesForm } from "#app/data/pokemon-species-form";
import type { QueuedMove } from "#app/@types/QueuedMove";
import type { PokemonMove } from "#app/field/pokemon-move";
import { Abilities } from "#enums/abilities";
import type { ElementalType } from "#enums/elemental-type";
import type { Gender } from "#enums/gender";

export class PokemonSummonData {
  /** [Atk, Def, SpAtk, SpDef, Spd, Acc, Eva] */
  public statStages: number[] = [0, 0, 0, 0, 0, 0, 0];
  public moveQueue: QueuedMove[] = [];
  public tags: BattlerTag[] = [];
  public abilitySuppressed: boolean = false;
  public abilitiesApplied: Abilities[] = [];
  public speciesForm: PokemonSpeciesForm | null;
  public fusionSpeciesForm: PokemonSpeciesForm;
  public ability: Abilities = Abilities.NONE;
  public passiveAbility: Abilities = Abilities.NONE;
  public gender: Gender;
  public fusionGender: Gender;
  public stats: number[] = [0, 0, 0, 0, 0, 0];
  public moveset: PokemonMove[];
  // If not initialized this value will not be populated from save data.
  public types: ElementalType[] = [];
  public addedType: ElementalType | null = null;
}
