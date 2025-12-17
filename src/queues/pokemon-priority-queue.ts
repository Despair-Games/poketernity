import { ShuffledPriorityQueue } from "#app/queues/shuffled-priority-queue";
import type { Stat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import { speedOrderComparator } from "#utils/speed-order-utils";

/**
 * Stores a list of Pokemon ordered by {@link Stat.SPD | Speed}.
 * Use {@linkcode pop} to obtain the first Pokemon in Speed order.
 * Speed ties are resolved randomly.
 */
export class PokemonPriorityQueue extends ShuffledPriorityQueue<Pokemon> {
  constructor() {
    super(speedOrderComparator<Pokemon>);
  }
}
