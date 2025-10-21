import { globalScene } from "#app/global-scene";
import type { TrickRoomTag } from "#arena-tags/trick-room-tag";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { Stat } from "#enums/stat";
import { Pokemon } from "#field/pokemon";
import { ValueHolder } from "#utils/common-utils";

/** Interface representing an object associated with a specific Pokemon */
interface hasPokemon {
  getPokemon(): Pokemon;
}

/**
 * Comparator for sorting {@linkcode Pokemon} in Speed order, for use with {@linkcode Array.sort}.
 * This can be used to compare Pokemon directly or any object with a `getPokemon` method
 * (e.g. `PokemonPhases`).
 * @param a - The first Pokemon to compare
 * @param b - The second Pokemon to compare
 * @returns A negative number if `a` precedes `b` in Speed order
 */
export function speedOrderComparator<T extends Pokemon | hasPokemon>(a: T, b: T): number {
  const aSpeed = (a instanceof Pokemon ? a : a.getPokemon()).getEffectiveStat(Stat.SPD);
  const bSpeed = (b instanceof Pokemon ? b : b.getPokemon()).getEffectiveStat(Stat.SPD);

  const speedReversed = new ValueHolder(false);
  globalScene.arena.applyTags<TrickRoomTag>(ArenaTagType.TRICK_ROOM, ArenaTagSide.BOTH, false, speedReversed);

  return (bSpeed - aSpeed) * (speedReversed.value ? -1 : 1);
}
