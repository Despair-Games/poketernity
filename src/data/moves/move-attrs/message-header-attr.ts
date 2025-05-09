import type { MoveMessageFunc } from "#app/@types/MoveMessageFunc";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { Move } from "#moves/move";
import { MoveHeaderAttr } from "#moves/move-header-attr";

/**
 * Header attribute to queue a message at the beginning of a turn.
 * @extends MoveHeaderAttr
 */
export class MessageHeaderAttr extends MoveHeaderAttr {
  private message: string | MoveMessageFunc;

  constructor(message: string | MoveMessageFunc) {
    super();
    this.message = message;
  }

  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    const message = typeof this.message === "string" ? this.message : this.message(user, target, move);

    if (message) {
      globalScene.phaseManager.queueMessagePhase(message);
      return true;
    }
    return false;
  }
}
