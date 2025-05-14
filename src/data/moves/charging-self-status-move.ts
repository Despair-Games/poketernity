import { ChargeMove } from "#moves/charge-move";
import { SelfStatusMove } from "#moves/move";

export class ChargingSelfStatusMove extends ChargeMove(SelfStatusMove) {
  override isChargingSelfStatusMove(): this is this {
    return true;
  }
}
