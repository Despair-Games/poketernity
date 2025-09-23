import { ShuffledPriorityQueue } from "#app/queues/shuffled-priority-queue";
import { Stat } from "#enums/stat";
import type { PokemonPhase } from "#phases/base/pokemon-phase";

export class PokemonPhasePriorityQueue extends ShuffledPriorityQueue<PokemonPhase> {
  constructor() {
    super(PokemonPhasePriorityQueue.compare);
  }

  private static compare(phaseA: PokemonPhase, phaseB: PokemonPhase) {
    const [pokemonA, pokemonB] = [phaseA, phaseB].map((phase) => phase.getPokemon());
    return pokemonB.getEffectiveStat(Stat.SPD) - pokemonA.getEffectiveStat(Stat.SPD);
  }
}
