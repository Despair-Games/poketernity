import { CommonBattleAnim } from "#animations/common-battle-anim";
import { globalScene } from "#app/global-scene";
import type { FieldBattlerIndex } from "#enums/battler-index";
import type { CommonAnim } from "#enums/common-anim";
import { PokemonPhase } from "#phases/base/pokemon-phase";
import type { PhaseKey } from "#types/phase-types";

/**
 * Plays a {@linkcode CommonBattleAnim}
 */
export class CommonAnimPhase extends PokemonPhase {
  public override readonly phaseName: PhaseKey = "CommonAnimPhase";

  private anim: CommonAnim;
  private readonly targetIndex?: FieldBattlerIndex;

  constructor(anim: CommonAnim, battlerIndex?: FieldBattlerIndex, targetIndex?: FieldBattlerIndex) {
    // TODO: refactor `PokemonPhase` and/or this phase
    super(battlerIndex!);

    battlerIndex =
      battlerIndex
      ?? globalScene
        .getField()
        .find((p) => p?.isActive())
        ?.getBattlerIndex();
    if (battlerIndex === undefined) {
      console.warn("There are no Pokemon on the field!"); // TODO: figure out a suitable fallback behavior
    }

    this.anim = anim;
    this.battlerIndex = battlerIndex!;
    this.targetIndex = targetIndex;
  }

  public setAnimation(anim: CommonAnim): void {
    this.anim = anim;
  }

  public override start(): void {
    const user = this.getPokemon();
    const target = this.targetIndex ? globalScene.getPokemonByBattlerIndex(this.targetIndex) : user;
    new CommonBattleAnim(this.anim, user, target ?? user).play(false, () => this.end());
  }
}
