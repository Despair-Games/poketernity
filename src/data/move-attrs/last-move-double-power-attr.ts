import type { MoveId } from "#enums/move-id";
import { type Pokemon } from "#app/field/pokemon";
import { MoveResult } from "#enums/move-result";
import { globalScene } from "#app/global-scene";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";

/**
 * Attribute used for moves that double in power if the given move immediately
 * preceded the move applying the attribute, namely Fusion Flare and
 * Fusion Bolt.
 * @extends VariablePowerAttr
 */
export class LastMoveDoublePowerAttr extends VariablePowerAttr {
  /** The move that must precede the current move */
  private moveId: MoveId;

  constructor(moveId: MoveId) {
    super();

    this.moveId = moveId;
  }

  override apply(user: Pokemon, _target: Pokemon, _move: Move, power: NumberHolder): boolean {
    const enemy = user.getOpponent(0);
    const pokemonActed: Pokemon[] = [];

    if (enemy?.turnData.acted) {
      pokemonActed.push(enemy);
    }

    if (globalScene.currentBattle.double) {
      const userAlly = user.getAlly();
      const enemyAlly = enemy?.getAlly();

      if (userAlly && userAlly.turnData.acted) {
        pokemonActed.push(userAlly);
      }
      if (enemyAlly && enemyAlly.turnData.acted) {
        pokemonActed.push(enemyAlly);
      }
    }

    pokemonActed.sort((a, b) => b.turnData.order - a.turnData.order);

    for (const p of pokemonActed) {
      const [lastMove] = p.getLastXMoves(1);
      if (lastMove?.result !== MoveResult.FAIL) {
        if (lastMove?.result === MoveResult.SUCCESS && lastMove?.move.id === this.moveId) {
          power.value *= 2;
          return true;
        } else {
          break;
        }
      }
    }

    return false;
  }
}
