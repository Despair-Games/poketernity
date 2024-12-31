import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { Move } from "#app/data/move";
import { MoveHeaderAttr } from "#app/data/move-attrs/move-header-attr";

/**
 * Header attribute to queue a message at the beginning of a turn.
 * @see {@link MoveHeaderAttr}
 */

export class MessageHeaderAttr extends MoveHeaderAttr {
  private message: string | ((user: Pokemon, move: Move) => string);

  constructor(message: string | ((user: Pokemon, move: Move) => string)) {
    super();
    this.message = message;
  }

  /** Queues a message at the start of the turn */
  override apply(user: Pokemon, _target: Pokemon, move: Move): boolean {
    const message = typeof this.message === "string" ? this.message : this.message(user, move);

    if (message) {
      globalScene.queueMessage(message);
      return true;
    }
    return false;
  }
}
