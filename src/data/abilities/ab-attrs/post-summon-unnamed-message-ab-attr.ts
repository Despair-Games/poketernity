import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import { globalScene } from "#app/global-scene";
import type { Pokemon } from "#field/pokemon";

/**
 * Displays the message for Cloud Nine and Air Lock.
 * Doesn't display the pokemon's name.
 */
export class PostSummonUnnamedMessageAbAttr extends PostSummonAbAttr {
  private readonly message: string;

  constructor(message: string) {
    super();

    this.message = message;
  }

  public override apply(_pokemon: Pokemon, simulated: boolean): void {
    if (!simulated) {
      globalScene.phaseManager.createAndUnshiftPhase("MessagePhase", this.message);
    }
  }
}
