import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { BattleStat } from "#enums/stat";
import { AbAttr } from "./ab-attr";

export class StatStageAbAttr extends AbAttr {
  public stat: BattleStat;

  constructor(stat: BattleStat) {
    super(false);
    this.stat = stat;
  }

  applyStatStage(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _stat: BattleStat,
    _statValue: NumberHolder,
    ..._args: unknown[]
  ): boolean {
    return false;
  }
}
