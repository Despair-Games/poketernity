import { ShuffledPriorityQueue } from "#app/queues/shuffled-priority-queue";
import type { PokemonPhase } from "#phases/base/pokemon-phase";
import { speedOrderComparator } from "#utils/speed-order-utils";

export class PokemonPhasePriorityQueue extends ShuffledPriorityQueue<PokemonPhase> {
  constructor() {
    super(speedOrderComparator<PokemonPhase>);
  }
}
