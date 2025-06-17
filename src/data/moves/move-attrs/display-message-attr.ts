import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";

/**
 * Attribute to display a message
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
    globalScene.phaseManager.createAndUnshiftPhase("MessagePhase", replacedMessage);
    return true;
  }
}
