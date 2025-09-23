import { ShuffledPriorityQueue } from "#app/queues/shuffled-priority-queue";
import { Stat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";

export class PokemonPriorityQueue extends ShuffledPriorityQueue<Pokemon> {
  constructor() {
    super(PokemonPriorityQueue.compare);
  }

  private static compare(pokemonA: Pokemon, pokemonB: Pokemon) {
    const [aSpeed, bSpeed] = [pokemonA, pokemonB].map((p) => p.getEffectiveStat(Stat.SPD));
    return bSpeed - aSpeed;
  }
}
