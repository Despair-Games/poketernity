import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { ValueHolder } from "#utils/common-utils";

type AbAttrMoveCondition = (pokemon: Pokemon, move: Move) => boolean;

/**
 * This ability attribute changes the priority of the ability holder's moves by a specified amount if certain conditions have been met
 * +-----------------+--------------+-------------------------+
 * |  Ability Name   | Priority +/- |        Condition        |
 * +-----------------+--------------+-------------------------+
 * | Prankster       | +1           | Status moves            |
 * | Gale Wings      | +1           | Flying moves at full HP |
 * | Triage          | +3           | HP-Recovery Moves       |
 * | Mycellium Might | -0.2         | Status Moves            |
 * | Stall           | -0.2         |                         |
 * +-----------------+--------------+-------------------------+
 */
export class ChangeMovePriorityAbAttr extends AbAttr {
  /** The condition moves must follow for the priority change to apply */
  private readonly condition: AbAttrMoveCondition;
  /** The amount of priority added or subtracted */
  private readonly changeAmount: number;

  constructor(condition: AbAttrMoveCondition, changeAmount: number) {
    super(true);
    this._flags.add(AbAttrFlag.CHANGE_MOVE_PRIORITY);

    this.condition = condition;
    this.changeAmount = changeAmount;
  }

  public override apply(_pokemon: Pokemon, _simulated: boolean, _move: Move, priority: ValueHolder<number>): void {
    priority.value += this.changeAmount;
  }

  public override canApply(...[pokemon, , move]: Parameters<this["apply"]>): boolean {
    return this.condition(pokemon, move);
  }
}
