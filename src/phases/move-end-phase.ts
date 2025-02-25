// -- start tsdoc imports --
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type Arena } from "#app/field/arena";
// -- end tsdoc imports --

import type { BattlerIndex } from "#enums/battler-index";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { globalScene } from "#app/global-scene";
import { PokemonPhase } from "./abstract-pokemon-phase";
import type { MovePhase } from "./move-phase";
import { PhaseId } from "#enums/phase-id";

/**
 * Lapses {@linkcode BattlerTagLapseType.AFTER_MOVE} and calls {@linkcode Arena.setIgnoreAbilities}`(false)`
 * @extends PokemonPhase
 */
export class MoveEndPhase extends PokemonPhase {
  override readonly id = PhaseId.MOVE_END;

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

    if (!globalScene.findPhase((phase) => phase.is<MovePhase>(PhaseId.MOVE))) {
      const { turnManager } = globalScene.currentBattle;

      // Reset turn order in case the last move affected Speed
      turnManager.setTurnOrder();
      // Pull commands from the turn manager until empty or a new
      // move phase is queued
      turnManager.scheduleNextValidCommand();
    }
    this.end();
  }
}
