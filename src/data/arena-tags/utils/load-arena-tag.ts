import type { ArenaTag } from "#arena-tags/arena-tag";
import { getArenaTag } from "#arena-tags/utils/get-arena-tag";

/**
 * When given a battler tag or json representing one, creates an actual ArenaTag object with the same data.
 * @param source - The source {@linkcode ArenaTag}
 * @returns The valid {@linkcode ArenaTag}
 */
export function loadArenaTag(source: ArenaTag | any): ArenaTag | undefined {
  const tag = getArenaTag(source.tagType, source.sourceId, source.turnCount, source.sourceMoveId, source.side);
  tag?.loadTag(source);
  return tag;
}
