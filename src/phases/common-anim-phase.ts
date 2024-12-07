import type { BattlerIndex } from "#app/battle";
import type { CommonAnim } from "#app/data/battle-anims";
import { CommonBattleAnim } from "#app/data/battle-anims";
import { globalScene } from "#app/global-scene";
import { PokemonPhase } from "./pokemon-phase";

export class CommonAnimPhase extends PokemonPhase {
  private anim: CommonAnim | null;
  private targetIndex?: BattlerIndex;

  constructor(battlerIndex?: BattlerIndex, targetIndex?: BattlerIndex, anim: CommonAnim | null = null) {
    super(battlerIndex);

    this.anim = anim;
    this.targetIndex = targetIndex;
  }

  public setAnimation(anim: CommonAnim): void {
    this.anim = anim;
  }

  public override start(): void {
    const target =
      this.targetIndex !== undefined
        ? (this.player ? globalScene.getEnemyField() : globalScene.getPlayerField())[this.targetIndex]
        : this.getPokemon();
    new CommonBattleAnim(this.anim, this.getPokemon(), target).play(false, () => {
      this.end();
    });
  }
}
