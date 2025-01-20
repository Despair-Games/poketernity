import type { BattlerIndex } from "#enums/battler-index";
import type { CommonAnim } from "#app/data/battle-anims";
import { CommonBattleAnim } from "#app/data/battle-anims";
import { PokemonPhase } from "#app/phases/abstract-pokemon-phase";
import { globalScene } from "#app/global-scene";

/**
 * Plays a {@linkcode CommonBattleAnim}
 * @extends PokemonPhase
 */
export class CommonAnimPhase extends PokemonPhase {
  private anim: CommonAnim | null;
  private readonly targetIndex?: BattlerIndex;

  constructor(battlerIndex?: BattlerIndex, targetIndex?: BattlerIndex, anim: CommonAnim | null = null) {
    super(battlerIndex);

    this.anim = anim;
    this.targetIndex = targetIndex;
  }

  public setAnimation(anim: CommonAnim): void {
    this.anim = anim;
  }

  public override start(): void {
    const user = this.getPokemon();
    const target = globalScene.getFieldPokemonByBattlerIndex(this.targetIndex) ?? user;
    new CommonBattleAnim(this.anim, user, target).play(false, () => {
      this.end();
    });
  }
}
