import { globalScene } from "#app/global-scene";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveAttr } from "#moves/move-attr";
import type { MoveMessageFunc } from "#types/move-message-func";

/**
 * Attribute to queue a message before a move deals damage
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
