import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import { globalScene } from "#app/global-scene";
import type { Pokemon } from "#field/pokemon";

/**
 * Displays the message for Cloud Nine and Air Lock.
 * Doesn't display the pokemon's name.
 * @extends PostSummonAbAttr
 */
export class PostSummonUnnamedMessageAbAttr extends PostSummonAbAttr {
  private readonly message: string;

  constructor(message: string) {
    super(true);

    this.message = message;
  }

  override apply(_pokemon: Pokemon, simulated: boolean): boolean {
    if (!simulated) {
      globalScene.phaseManager.queueMessagePhase(this.message);
    }

    return true;
  }
}
