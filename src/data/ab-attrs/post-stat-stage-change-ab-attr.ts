import type { Pokemon } from "#app/field/pokemon";
import type { BattleStat } from "#enums/stat";
import { AbAttr } from "./ab-attr";

export class PostStatStageChangeAbAttr extends AbAttr {
  override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _statsChanged: BattleStat[],
    _stagesChanged: number,
    _selfTarget: boolean,
  ): boolean {
    return false;
  }
}
