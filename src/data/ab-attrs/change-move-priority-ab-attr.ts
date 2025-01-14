import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";

type AbAttrMoveCondition = (pokemon: Pokemon, move: Move) => boolean;

/**
 * This governs abilities that alter the priority of moves
 * Abilities: Prankster, Gale Wings, Triage, Mycelium Might, Stall
 * Note - Quick Claw has a separate and distinct implementation outside of priority
 */
export class ChangeMovePriorityAbAttr extends AbAttr {
  /** The condition moves must follow for the priority change to apply */
  private readonly moveFunc: AbAttrMoveCondition;
  /** The amount of priority added or subtracted */
  private readonly changeAmount: number;

  constructor(moveFunc: AbAttrMoveCondition, changeAmount: number) {
    super(true);

    this.moveFunc = moveFunc;
    this.changeAmount = changeAmount;
  }

  override apply(pokemon: Pokemon, _simulated: boolean, move: Move, priority: NumberHolder): boolean {
    if (!this.moveFunc(pokemon, move)) {
      return false;
    }

    priority.value += this.changeAmount;
    return true;
  }
}
