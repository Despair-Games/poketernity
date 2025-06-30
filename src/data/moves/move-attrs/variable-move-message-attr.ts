import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveAttr } from "#moves/move-attr";
import type { MoveMessageFunc } from "#types/move-message-func";

/**
 * Attribute to override the default move usage message (e.g. "Pikachu used Thunderbolt!")
 * with a custom message which can change based on game state.
 */
export abstract class VariableMoveMessageAttr extends MoveAttr {
  protected message: string | MoveMessageFunc;

  constructor(message: string | MoveMessageFunc) {
    super();
    this.message = message;
  }

  /**
   * Obtains the message to be displayed when the move is used.
   * **NOTE**: This should only return localized messages.
   * @param user - The {@linkcode Pokemon} using the move
   * @param target - The {@linkcode Pokemon} targeted by the move
   * @param move - The {@linkcode Move} being used
   * @returns The custom message to display, or `undefined` to use the default message
   */
  public getMoveMessage(user: Pokemon, target: Pokemon, move: Move): string | undefined {
    if (typeof this.message === "string") {
      return this.message;
    }
    return this.message(user, target, move);
  }
}
