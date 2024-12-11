import type { BattleStat } from "#app/enums/stat";
import type Pokemon from "#app/field/pokemon";
import { AbAttr } from "./ab-attr";

export class PostStatStageChangeAbAttr extends AbAttr {
  applyPostStatStageChange(
    _pokemon: Pokemon,
    _simulated: boolean,
    _statsChanged: BattleStat[],
    _stagesChanged: integer,
    _selfTarget: boolean,
    _args: any[],
  ): boolean {
    return false;
  }
}
