import type { MoveConditionFunc } from "#app/@types/move-condition-func";
import { globalScene } from "#app/global-scene";
import type { StockpilingTag } from "#battler-tags/stockpiling-tag";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { MovePhase } from "#phases/move-phase";

export const hasStockpileStacksCondition: MoveConditionFunc = (user) => {
  const snatched = globalScene.phaseManager.getCurrentPhase<MovePhase>()?.snatched;
  const hasStockpilingTag = user.getTag<StockpilingTag>(BattlerTagType.STOCKPILING);
  return !!snatched || (!!hasStockpilingTag && hasStockpilingTag.stockpiledCount > 0);
};
