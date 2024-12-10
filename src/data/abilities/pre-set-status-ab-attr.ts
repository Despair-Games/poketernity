import type Pokemon from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import type { StatusEffect } from "#enums/status-effect";
import { AbAttr } from "./ab-attr";

export class PreSetStatusAbAttr extends AbAttr {
  applyPreSetStatus(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _effect: StatusEffect | undefined,
    _cancelled: BooleanHolder,
    _args: any[],
  ): boolean {
    return false;
  }
}
