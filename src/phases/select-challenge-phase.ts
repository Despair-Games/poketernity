import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import type { ChallengeSelectUiHandler } from "#app/ui/handlers/challenges-select-ui-handler";
import { PhaseId } from "#enums/phase-id";
import { UiMode } from "#enums/ui-mode";

export class SelectChallengePhase extends Phase {
  override readonly id = PhaseId.SELECT_CHALLENGE;

  public override start(): void {
    super.start();

    globalScene.audioManager.playBgm("menu");

    globalScene.ui.setMode<ChallengeSelectUiHandler>(UiMode.CHALLENGE_SELECT);
  }
}
