import { globalScene } from "#app/global-scene";
import { FieldPhase } from "#phases/base/field-phase";

/**
 * Phase for determining an enemy AI's action for the next turn.
 *
 * During this phase, the enemy decides whether to switch (if it has a trainer)
 * or to use a move from its moveset.
 * @see {@linkcode Pokemon.getMatchupScore}
 * @see {@linkcode EnemyPokemon.getNextMove}
 */
export class EnemyCommandPhase extends FieldPhase {
  public override readonly phaseName = "EnemyCommandPhase";

  public readonly fieldIndex: number;

  constructor(fieldIndex: number) {
    super();

    this.fieldIndex = fieldIndex;
  }

  public override start(): void {
    super.start();

    if (globalScene.currentBattle.mysteryEncounter?.skipEnemyBattleTurns) {
      this.end();
      return;
    }

    const pokemon = globalScene.getEnemyField()[this.fieldIndex];
    if (!pokemon) {
      this.end();
      return;
    }

    const nextCommand = pokemon.getNextCommand();
    if (!nextCommand) {
      this.end();
      return;
    }

    const battle = globalScene.currentBattle;
    battle.turnManager.addCommand(nextCommand);
    /**
     * This is currently unused. It was used before to discourage Trainers from
     * choosing to switch over multiple consecutive turns.
     * @todo Should this still be factored into command selection?
     */
    battle.enemySwitchCounter = Math.max(battle.enemySwitchCounter - 1, 0);

    this.end();
  }
}
