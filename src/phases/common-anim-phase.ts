import type { BattlerIndex } from "#enums/battler-index";
import { globalScene } from "#app/global-scene";
import { CommonBattleAnim } from "#app/data/battle-anims";
import { PokemonPhase } from "./pokemon-phase";
import type { CommonAnim } from "#enums/common-anim";

export class CommonAnimPhase extends PokemonPhase {
  private anim: CommonAnim | null;
  private targetIndex?: BattlerIndex;
  private playOnEmptyField: boolean;

  constructor(
    battlerIndex?: BattlerIndex,
    targetIndex?: BattlerIndex,
    anim: CommonAnim | null = null,
    playOnEmptyField: boolean = false,
  ) {
    super(battlerIndex);

    this.anim = anim;
    this.targetIndex = targetIndex;
    this.playOnEmptyField = playOnEmptyField;
  }

  setAnimation(anim: CommonAnim) {
    this.anim = anim;
  }

  override start() {
    const target =
      this.targetIndex !== undefined
        ? (this.player ? globalScene.getEnemyField() : globalScene.getPlayerField())[this.targetIndex]
        : this.getPokemon();
    new CommonBattleAnim(this.anim, this.getPokemon(), target).play(false, () => {
      this.end();
    });
  }
}
