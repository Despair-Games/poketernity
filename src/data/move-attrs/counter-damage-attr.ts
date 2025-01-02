import type { Pokemon, AttackMoveResult } from "#app/field/pokemon";
import { type NumberHolder, toDmgValue } from "#app/utils";
import { type Move } from "#app/data/move";
import { allMoves } from "#app/data/all-moves";
import { FixedDamageAttr } from "#app/data/move-attrs/fixed-damage-attr";
import type { MoveConditionFunc } from "../move-conditions";

type MoveFilter = (move: Move) => boolean;

/**
 * Attribute to modify damage based on the damage received by the user from attacks
 * that satisfy a given {@linkcode moveFilter move filter}.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Move_variations#Variations_of_Counter variants of Counter},
 * including Metal Burst and Comeuppance.
 * @extends FixedDamageAttr
 */
export class CounterDamageAttr extends FixedDamageAttr {
  private moveFilter: MoveFilter;
  private multiplier: number;

  constructor(moveFilter: MoveFilter, multiplier: number) {
    super(0);

    this.moveFilter = moveFilter;
    this.multiplier = multiplier;
  }

  override apply(user: Pokemon, _target: Pokemon, _move: Move, damage: NumberHolder): boolean {
    const damageTaken = user.turnData.attacksReceived
      .filter((ar) => this.moveFilter(allMoves[ar.move]))
      .reduce((total: number, ar: AttackMoveResult) => total + ar.damage, 0);
    damage.value = toDmgValue(damageTaken * this.multiplier);

    return true;
  }

  override getCondition(): MoveConditionFunc {
    return (user, _target, _move) =>
      !!user.turnData.attacksReceived.filter((ar) => this.moveFilter(allMoves[ar.move])).length;
  }
}
