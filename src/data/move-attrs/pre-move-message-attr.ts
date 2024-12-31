import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { Move } from "#app/data/move";
import { MoveAttr } from "#app/data/move-attrs/move-attr";

export class PreMoveMessageAttr extends MoveAttr {
  private message: string | ((user: Pokemon, target: Pokemon, move: Move) => string);

  constructor(message: string | ((user: Pokemon, target: Pokemon, move: Move) => string)) {
    super();
    this.message = message;
  }

  /**
   * Queues a message before the move is used
   * @param user the {@linkcode Pokemon} using the move
   * @param target the {@linkcode Pokemon} targeted by the move
   * @param move the {@linkcode Move} being used
   * @returns `true` if the message is queued successfully
   */
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    const message = typeof this.message === "string" ? (this.message as string) : this.message(user, target, move);
    if (message) {
      globalScene.queueMessage(message, 500);
      return true;
    }
    return false;
  }
}
