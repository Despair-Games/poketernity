import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import type { StockpilingTag } from "#app/data/battler-tags/stockpiling-tag";
import { BattlerTagType } from "#enums/battler-tag-type";

export const hasStockpileStacksCondition: MoveConditionFunc = (user) => {
  const hasStockpilingTag = user.getTag<StockpilingTag>(BattlerTagType.STOCKPILING);
  return !!hasStockpilingTag && hasStockpilingTag.stockpiledCount > 0;
};
