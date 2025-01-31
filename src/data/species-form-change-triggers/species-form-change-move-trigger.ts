import { SpeciesFormChangeTrigger } from "#app/data/species-form-change-triggers/species-form-change-trigger";
import type { Moves } from "#enums/moves";

export abstract class SpeciesFormChangeMoveTrigger extends SpeciesFormChangeTrigger {
  public movePredicate: (m: Moves) => boolean;
  public used: boolean;

  constructor(move: Moves | ((m: Moves) => boolean), used: boolean = true) {
    super();
    this.movePredicate = typeof move === "function" ? move : (m: Moves) => m === move;
    this.used = used;
  }
}
