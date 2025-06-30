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
      return this.end();
    }

    const nextCommand = pokemon.getNextCommand();
    if (!nextCommand) {
      return this.end();
    }

    const battle = globalScene.currentBattle;
    battle.turnManager.addCommand(nextCommand);
    /**
     * @todo Should we keep this? it was a factor in the old switch logic
     * that might still be useful
     */
    battle.enemySwitchCounter = Math.max(battle.enemySwitchCounter - 1, 0);

    this.end();
  }
}
