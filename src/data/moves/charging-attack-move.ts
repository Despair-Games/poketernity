import { ChargeMove } from "#moves/charge-move";
import { AttackMove } from "#moves/move";

export class ChargingAttackMove extends ChargeMove(AttackMove) {
  override isChargingAttackMove(): this is this {
    return true;
  }
}
