import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import type { StockpilingTag } from "#app/data/battler-tags/stockpiling-tag";
import { globalScene } from "#app/global-scene";
import type { MovePhase } from "#app/phases/move-phase";
import { BattlerTagType } from "#enums/battler-tag-type";

export const hasStockpileStacksCondition: MoveConditionFunc = (user) => {
  const snatched = globalScene.phaseManager.getCurrentPhase<MovePhase>()?.snatched;
  const hasStockpilingTag = user.getTag<StockpilingTag>(BattlerTagType.STOCKPILING);
  return !!snatched || (!!hasStockpilingTag && hasStockpilingTag.stockpiledCount > 0);
};
