// -- start tsdoc imports --
/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { TurnCommand } from "#app/turn-command-manager";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */
// -- end tsdoc imports --

import { globalScene } from "#app/global-scene";
import type { BattlerIndex } from "#enums/battler-index";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { PhaseId } from "#enums/phase-id";
import { PokemonPhase } from "#phases/abstract-pokemon-phase";

/**
 * Does the following after a {@linkcode Pokemon}'s {@linkcode TurnCommand} is resolved:
 * 1. If the Pokemon used a move, lapse all of its {@linkcode BattlerTagLapseType.AFTER_MOVE | AFTER_MOVE}
 * battler tags
 * 2. Reset the flag to ignore abilities on the field (e.g. from the
 * Pokemon's Mold Breaker)
 * 3. Prompt the {@linkcode TurnCommandManager} to schedule the next
 * Pokemon's turn command for execution, if needed.
 * 4. If no valid command is scheduled in the last step, schedule phases
 * for the end-of-turn sequence
 */
export class PostActionPhase extends PokemonPhase {
  override readonly id = PhaseId.POST_ACTION;

  private readonly forMove: boolean;

  constructor(battlerIndex: BattlerIndex, forMove: boolean = false) {
    super(battlerIndex);

    this.forMove = forMove;
  }

  public override start(): void {
    super.start();

    const { arena, currentBattle } = globalScene;
    const { turnManager } = currentBattle;
    const pokemon = this.getPokemon();

    if (this.forMove && pokemon?.isActive(true)) {
      pokemon.lapseTags(BattlerTagLapseType.AFTER_MOVE);
    }

    arena.setIgnoreAbilities(false);
    turnManager.commandsInProgress--;
    console.log(`commandsInProgress: ${turnManager.commandsInProgress}`);

    if (turnManager.commandsInProgress < 1) {
      // Reset turn order in case the last action affected Speed
      turnManager.setTurnOrder();
      // Pull commands from the turn manager until empty or
      // a phase is queued
      turnManager.scheduleNextValidCommand();
    }

    this.end();
  }
}
