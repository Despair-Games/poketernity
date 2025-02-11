import { SpeciesFormChangeTrigger } from "#app/data/species-form-change-triggers/species-form-change-trigger";
import type { MoveId } from "#enums/move-id";

export abstract class SpeciesFormChangeMoveTrigger extends SpeciesFormChangeTrigger {
  public movePredicate: (m: MoveId) => boolean;
  public used: boolean;

  constructor(move: MoveId | ((mId: MoveId) => boolean), used: boolean = true) {
    super();
    this.movePredicate = typeof move === "function" ? move : (m: MoveId) => m === move;
    this.used = used;
  }
}
