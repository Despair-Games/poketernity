import type { BattlerTagType } from "#enums/battler-tag-type";
import { HitsTagAttr } from "#app/data/move-attrs/hits-tag-attr";

/**
 * Used for moves that will always hit for a given tag but also doubles damage.
 * Moves include: Gust, Stomp, Body Slam, Surf, Earthquake, Magnitude, Twister,
 * Whirlpool, Dragon Rush, Heat Crash, Steam Roller, Flying Press
 */
export class HitsTagForDoubleDamageAttr extends HitsTagAttr {
  constructor(tagType: BattlerTagType) {
    super(tagType, true);
  }
}
