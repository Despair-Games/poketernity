import type { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { BattlerTagType } from "#enums/battler-tag-type";

/**
 * Applies all tags of the given tag type(s) until a tag's `apply`
 * function returns with `true`.
 * @param tagTypes The type(s) of tags to apply; can be a single {@linkcode BattlerTagType}
 * or an array.
 * @param params The parameters for the specified tag class's `apply` function, including
 * - `pokemon`: the {@linkcode Pokemon} with the tag
 * - `simulated`: `true` if this apply call should be resolved without changing game state
 * - any additional arguments specific to the tag class
 * @returns `true` if a tag applied successfully
 */
export function applyBattlerTags<T extends BattlerTag = BattlerTag>(
  tagTypes: BattlerTagType | readonly BattlerTagType[],
  ...params: Parameters<T["apply"]>
): boolean {
  const [pokemon, simulated, ...args] = params;
  const tagTypeArr = Array.isArray(tagTypes) ? tagTypes : [tagTypes];

  const tags = pokemon.findTags((tag) => tagTypeArr.includes(tag.tagType));
  return tags.some((tag) => tag.apply(pokemon, simulated, ...args));
}
