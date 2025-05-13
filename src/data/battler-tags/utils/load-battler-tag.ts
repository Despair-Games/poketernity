import type { BattlerTag } from "#battler-tags/battler-tag";
import { getBattlerTag } from "#battler-tags/get-battler-tag";

/**
 * When given a battler tag or json representing one, creates an actual BattlerTag object with the same data.
 * @param source A battler tag
 * @return The valid battler tag
 */
export function loadBattlerTag(source: BattlerTag | any): BattlerTag {
  const tag = getBattlerTag(source.tagType, source.turnCount, source.sourceMoveId, source.sourceId);
  tag.loadTag(source);
  return tag;
}
