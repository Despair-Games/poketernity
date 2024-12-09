import type { BattlerIndex } from "#app/battle";
import { BattlerTagLapseType } from "#app/data/battler-tags";
import { globalScene } from "#app/global-scene";
import { PokemonPhase } from "./pokemon-phase";

/** Lapses {@linkcode BattlerTagLapseType.AFTER_MOVE} and calls `Arena.setIgnoreAbilities(false)` */
export class MoveEndPhase extends PokemonPhase {
  constructor(battlerIndex: BattlerIndex) {
    super(battlerIndex);
  }

  public override start(): void {
    super.start();

    const pokemon = this.getPokemon();
    if (pokemon.isActive(true)) {
      pokemon.lapseTags(BattlerTagLapseType.AFTER_MOVE);
    }

    globalScene.arena.setIgnoreAbilities(false);

    this.end();
  }
}
