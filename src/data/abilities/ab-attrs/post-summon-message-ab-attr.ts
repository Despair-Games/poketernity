import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";

export class PostSummonMessageAbAttr extends PostSummonAbAttr {
  private readonly messageFunc: (pokemon: Pokemon) => string;

  constructor(messageFunc: (pokemon: Pokemon) => string) {
    super(true);

    this.messageFunc = messageFunc;
  }

  override apply(pokemon: Pokemon, simulated: boolean): boolean {
    if (!simulated) {
      globalScene.phaseManager.queueMessagePhase(this.messageFunc(pokemon));
    }

    return true;
  }
}
