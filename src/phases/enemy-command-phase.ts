import { BattlerIndex } from "#enums/battler-index";
import { globalScene } from "#app/global-scene";
import { FieldPhase } from "./abstract-field-phase";

/**
 * Phase for determining an enemy AI's action for the next turn.
 * During this phase, the enemy decides whether to switch (if it has a trainer)
 * or to use a move from its moveset.
 * @extends FieldPhase
 */
export class EnemyCommandPhase extends FieldPhase {
  protected readonly fieldIndex: number;
  protected skipTurn: boolean = false;

  constructor(fieldIndex: number) {
    super();

    this.fieldIndex = fieldIndex;
    if (globalScene.currentBattle.mysteryEncounter?.skipEnemyBattleTurns) {
      this.skipTurn = true;
    }
  }

  public override start(): void {
    super.start();

    const pokemon = globalScene.getEnemyField()[this.fieldIndex];
    if (!pokemon) {
      return this.end();
    }

    const nextCommand = pokemon.getNextCommand();
    if (!nextCommand) {
      return this.end();
    }

    const battle = globalScene.currentBattle;
    battle.turnCommands[this.fieldIndex + BattlerIndex.ENEMY] = nextCommand;
    /**
     * @todo Should we keep this? it was a factor in the old switch logic
     * that might still be useful
     */
    battle.enemySwitchCounter = Math.max(battle.enemySwitchCounter - 1, 0);

    this.end();
  }

  public getFieldIndex(): number {
    return this.fieldIndex;
  }
}
