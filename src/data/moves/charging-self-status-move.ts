import { SelfStatusMove } from "#app/data/moves/move";
import { ChargeMove } from "./charge-move";

export class ChargingSelfStatusMove extends ChargeMove(SelfStatusMove) {
  override isChargingSelfStatusMove(): this is this {
    return true;
  }
}
