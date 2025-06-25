import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import { globalScene } from "#app/global-scene";
import type { Pokemon } from "#field/pokemon";

export class PostSummonMessageAbAttr extends PostSummonAbAttr {
  private readonly messageFunc: (pokemon: Pokemon) => string;

  constructor(messageFunc: (pokemon: Pokemon) => string) {
    super(true);

    this.messageFunc = messageFunc;
  }

  public override apply(pokemon: Pokemon, simulated: boolean): boolean {
    if (!simulated) {
      globalScene.phaseManager.createAndUnshiftPhase("MessagePhase", this.messageFunc(pokemon));
    }

    return true;
  }
}
