import { globalScene } from "#app/global-scene";
import type { BattlerIndex } from "#enums/battler-index";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { PokemonPhase } from "./pokemon-phase";

export class MoveEndPhase extends PokemonPhase {
  constructor(battlerIndex: BattlerIndex) {
    super(battlerIndex);
  }

  override start() {
    super.start();

    const pokemon = this.getPokemon();
    if (pokemon.isActive(true)) {
      pokemon.lapseTags(BattlerTagLapseType.AFTER_MOVE);
    }

    globalScene.arena.setIgnoreAbilities(false);

    this.end();
  }
}
