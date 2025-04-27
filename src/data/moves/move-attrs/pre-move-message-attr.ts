import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { Move } from "#app/data/moves/move";
import { MoveAttr } from "#app/data/moves/move-attrs/move-attr";
import type { MoveMessageFunc } from "#app/@types/MoveMessageFunc";

/**
 * Attribute to queue a message before a move deals damage
 * @extends MoveAttr
 */
export class PreMoveMessageAttr extends MoveAttr {
  private message: string | MoveMessageFunc;

  constructor(message: string | MoveMessageFunc) {
    super();
    this.message = message;
  }

  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    const message = typeof this.message === "string" ? (this.message as string) : this.message(user, target, move);
    if (message) {
      globalScene.phaseManager.queueMessagePhase(message, 500);
      return true;
    }
    return false;
  }
}
