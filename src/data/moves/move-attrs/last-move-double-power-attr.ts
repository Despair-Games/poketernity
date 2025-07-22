import { globalScene } from "#app/global-scene";
import type { MoveId } from "#enums/move-id";
import { MoveResult } from "#enums/move-result";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariablePowerAttr } from "#moves/variable-power-attr";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Attribute used for moves that double in power if the given move immediately
 * preceded the move applying the attribute, namely Fusion Flare and
 * Fusion Bolt.
 */
export class LastMoveDoublePowerAttr extends VariablePowerAttr {
  /** The move that must precede the current move */
  private moveId: MoveId;

  constructor(moveId: MoveId) {
    super();

    this.moveId = moveId;
  }

  override apply(user: Pokemon, _target: Pokemon, _move: Move, power: NumberHolder): boolean {
    const [target] = user.getOpponents();
    const pokemonActed: Pokemon[] = [];

    if (target?.turnData.acted) {
      pokemonActed.push(target);
    }

    if (globalScene.currentBattle.double) {
      const userAlly = user.getAlly();
      const enemyAlly = target?.getAlly();

      if (userAlly?.turnData.acted) {
        pokemonActed.push(userAlly);
      }
      if (enemyAlly?.turnData.acted) {
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
        }
        break;
      }
    }

    return false;
  }
}
