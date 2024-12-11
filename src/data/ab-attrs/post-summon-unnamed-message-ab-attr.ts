import type Pokemon from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { PostSummonAbAttr } from "./post-summon-ab-attr";

/**
 * Displays the message for Cloud Nine and Air Lock.
 * Doesn't display the pokemon's name.
 * @extends PostSummonAbAttr
 */
export class PostSummonUnnamedMessageAbAttr extends PostSummonAbAttr {
  private message: string;

  constructor(message: string) {
    super(true);

    this.message = message;
  }

  override applyPostSummon(_pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    if (!simulated) {
      globalScene.queueMessage(this.message);
    }

    return true;
  }
}
