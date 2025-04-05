import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { Move } from "#app/data/moves/move";
import { MoveHeaderAttr } from "#app/data/moves/move-attrs/move-header-attr";

/**
 * Header attribute to queue a message at the beginning of a turn.
 * @extends MoveHeaderAttr
 */
export class MessageHeaderAttr extends MoveHeaderAttr {
  private message: string | ((user: Pokemon, move: Move) => string | undefined);

  constructor(message: string | ((user: Pokemon, move: Move) => string | undefined)) {
    super();
    this.message = message;
  }

  override apply(user: Pokemon, _target: Pokemon, move: Move): boolean {
    const message = typeof this.message === "string" ? this.message : this.message(user, move);

    if (message) {
      globalScene.phaseManager.queueMessagePhase(message);
      return true;
    }
    return false;
  }
}
