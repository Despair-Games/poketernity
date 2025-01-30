import type { Stat } from "#enums/stat";

export interface StockpilingStatStageChangeCount {
  [Stat.DEF]: number;
  [Stat.SPDEF]: number;
}
