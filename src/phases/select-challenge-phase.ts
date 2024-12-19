import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { Mode } from "#app/ui/ui";

export class SelectChallengePhase extends Phase {
  public override start(): void {
    super.start();

    globalScene.playBgm("menu");

    globalScene.ui.setMode(Mode.CHALLENGE_SELECT);
  }
}
