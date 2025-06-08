import { CommonBattleAnim } from "#animations/common-battle-anim";
import { globalScene } from "#app/global-scene";
import type { BattlerIndex } from "#enums/battler-index";
import type { CommonAnim } from "#enums/common-anim";
import { PokemonPhase } from "#phases/abstract-pokemon-phase";
import type { PhaseString } from "#types/phase-types";

/**
 * Plays a {@linkcode CommonBattleAnim}
 */
export class CommonAnimPhase extends PokemonPhase {
  // Type hint required due to this class being extended by others
  public override readonly phaseName: PhaseString = "CommonAnimPhase";

  private anim: CommonAnim;
  private readonly targetIndex?: BattlerIndex;

  constructor(anim: CommonAnim, battlerIndex?: BattlerIndex, targetIndex?: BattlerIndex) {
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
