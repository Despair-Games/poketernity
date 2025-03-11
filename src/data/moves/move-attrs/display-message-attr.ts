import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/moves/move";
import { globalScene } from "#app/global-scene";
import { MoveEffectAttr } from "./move-effect-attr";
import { getPokemonNameWithAffix } from "#app/messages";

/**
 * Attribute to display a message
 * @extends MoveEffectAttr
 */
export class DisplayMessageAttr extends MoveEffectAttr {
  private displayMessage: string;

  constructor(displayMessage: string) {
    super();
    this.displayMessage = displayMessage;
  }
  /**
   * Displays the intended message
   * @param user The user of the move
   * @param target The target of the move
   * @param _move n/a
   * @returns `true`
   */
  override applyEffect(user: Pokemon, target: Pokemon | null, _move: Move): boolean {
    const replacedMessage = this.displayMessage
      .replace("{USER}", getPokemonNameWithAffix(user))
      .replace("{TARGET}", getPokemonNameWithAffix(target));
    globalScene.queueMessage(replacedMessage);
    return true;
  }
}
