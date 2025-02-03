import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { PhaseId } from "#enums/phase-id";
import { UiMode } from "#enums/ui-mode";

export class SelectChallengePhase extends Phase {
  constructor() {
    super();
    this._id = PhaseId.SELECT_CHALLENGE;
  }

  public override start(): void {
    super.start();

    globalScene.playBgm("menu");

    globalScene.ui.setMode(UiMode.CHALLENGE_SELECT);
  }
}
