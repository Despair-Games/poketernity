import { globalScene } from "#app/global-scene";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveHeaderAttr } from "#moves/move-header-attr";
import type { MoveMessageFunc } from "#types/move-types";

/**
 * Header attribute to queue a message at the beginning of a turn.
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
      globalScene.phaseManager.createAndUnshiftPhase("MessagePhase", message);
      return true;
    }
    return false;
  }
}
