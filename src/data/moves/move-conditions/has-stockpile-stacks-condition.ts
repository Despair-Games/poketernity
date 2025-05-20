import { globalScene } from "#app/global-scene";
import type { StockpilingTag } from "#battler-tags/stockpiling-tag";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { MovePhase } from "#phases/move-phase";
import type { MoveConditionFunc } from "#types/move-condition-func";

export const hasStockpileStacksCondition: MoveConditionFunc = (user) => {
  const snatched = globalScene.phaseManager.getCurrentPhase<MovePhase>()?.snatched;
  const hasStockpilingTag = user.getTag<StockpilingTag>(BattlerTagType.STOCKPILING);
  return !!snatched || (!!hasStockpilingTag && hasStockpilingTag.stockpiledCount > 0);
};
