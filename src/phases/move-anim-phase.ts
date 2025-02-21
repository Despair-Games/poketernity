import type { MoveAnim } from "#app/data/battle-anims/move-anim";
import { Phase } from "#app/phase";
import { PhaseId } from "#enums/phase-id";

/**
 * Plays the given {@linkcode MoveAnim} sequentially.
 * @extends Phase
 */
export class MoveAnimPhase<Anim extends MoveAnim> extends Phase {
  override readonly id = PhaseId.MOVE_ANIM;

  protected readonly anim: Anim;
  protected readonly onSubstitute: boolean;

  constructor(anim: Anim, onSubstitute: boolean = false) {
    super();

    this.anim = anim;
    this.onSubstitute = onSubstitute;
  }

  public override start(): void {
    super.start();

    this.anim.play(this.onSubstitute, () => this.end());
  }
}
