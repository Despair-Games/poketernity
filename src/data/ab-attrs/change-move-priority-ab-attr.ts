import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder, NumberHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";

/**
 * This governs abilities that alter the priority of moves
 * Abilities: Prankster, Gale Wings, Triage, Mycelium Might, Stall
 * Note - Quick Claw has a separate and distinct implementation outside of priority
 */
export class ChangeMovePriorityAbAttr extends AbAttr {
  private readonly moveFunc: (pokemon: Pokemon, move: Move) => boolean;
  private readonly changeAmount: number;

  /**
   * @param moveFunc applies priority-change to moves within a provided category
   * @param changeAmount the amount of priority added or subtracted
   */
  constructor(moveFunc: (pokemon: Pokemon, move: Move) => boolean, changeAmount: number) {
    super(true);

    this.moveFunc = moveFunc;
    this.changeAmount = changeAmount;
  }

  override apply(
    pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    const move: Move = args[0];
    const priority: NumberHolder = args[1];
    if (!this.moveFunc(pokemon, move)) {
      return false;
    }

    priority.value += this.changeAmount;
    return true;
  }
}
