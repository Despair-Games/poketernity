import { AttackMove } from "#app/data/moves/move";
import { ChargeMove } from "./charge-move";

export class ChargingAttackMove extends ChargeMove(AttackMove) {
  override isChargingAttackMove(): this is this {
    return true;
  }
}
