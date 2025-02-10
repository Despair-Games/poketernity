import { SelfStatusMove } from "#app/data/move";
import { ChargeMove } from "./charge-move";

export class ChargingSelfStatusMove extends ChargeMove(SelfStatusMove) {
  override isChargingSelfStatusMove(): this is this {
    return true;
  }
}
