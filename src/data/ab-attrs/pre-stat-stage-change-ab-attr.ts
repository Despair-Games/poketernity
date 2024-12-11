import type Pokemon from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import type { BattleStat } from "#enums/stat";
import { AbAttr } from "./ab-attr";

export class PreStatStageChangeAbAttr extends AbAttr {
  applyPreStatStageChange(
    _pokemon: Pokemon | null,
    _passive: boolean,
    _simulated: boolean,
    _stat: BattleStat,
    _cancelled: BooleanHolder,
    _args: any[],
  ): boolean {
    return false;
  }
}
