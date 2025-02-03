import { AttackMove } from "#app/data/move";
import { ChargeMove } from "./charge-move";

export class ChargingAttackMove extends ChargeMove(AttackMove) {}
