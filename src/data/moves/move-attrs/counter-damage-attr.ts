import type { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import { FixedDamageAttr } from "#moves/fixed-damage-attr";
import type { Move } from "#moves/move";
import type { AttackMoveResult } from "#types/attack-move-result";
import type { MoveConditionFunc } from "#types/move-condition-func";
import { type NumberHolder, toDmgValue } from "#utils/common-utils";

type MoveFilter = (moveId: MoveId) => boolean;

/**
 * Attribute to modify damage based on the damage received by the user from attacks
 * that satisfy a given {@linkcode moveFilter | move filter}.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Move_variations#Variations_of_Counter | variants of Counter},
 * including Metal Burst and Comeuppance.
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
      .filter((ar) => this.moveFilter(ar.moveId))
      .reduce((total: number, ar: AttackMoveResult) => total + ar.damage, 0);
    damage.value = toDmgValue(damageTaken * this.multiplier);

    return true;
  }

  override getCondition(): MoveConditionFunc {
    return (user, _target, _move) => user.turnData.attacksReceived.some((ar) => this.moveFilter(ar.moveId));
  }
}
