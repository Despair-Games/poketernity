import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { UiMode } from "#enums/ui-mode";
import type { ChallengeSelectUiHandler } from "#ui/challenges-select-ui-handler";

export class SelectChallengePhase extends Phase {
  public override readonly phaseName = "SelectChallengePhase";

  public override start(): void {
    super.start();

    globalScene.audioManager.playBgm("menu");

    globalScene.ui.setMode<ChallengeSelectUiHandler>(UiMode.CHALLENGE_SELECT);
  }
}
