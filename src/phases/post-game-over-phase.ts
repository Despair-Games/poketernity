import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { GameOverEvent } from "#events/battle-scene";
import type { EndCardPhase } from "#phases/end-card-phase";

export class PostGameOverPhase extends Phase {
  public override readonly phaseName = "PostGameOverPhase";

  private readonly endCardPhase?: EndCardPhase;

  constructor(endCardPhase?: EndCardPhase) {
    super();

    this.endCardPhase = endCardPhase;
  }

  public override start(): void {
    const { gameData, sessionSlotId, ui } = globalScene;

    const saveAndReset = (): void => {
      gameData.saveAll(true, true, true).then((isSuccess) => {
        if (!isSuccess) {
          return globalScene.reset(true);
        }
        gameData.tryClearSession(sessionSlotId).then((success: boolean | [boolean, boolean]) => {
          if (!success[0]) {
            return globalScene.reset(true);
          }
          globalScene.reset();
          globalScene.phaseManager.toTitleScreen({ eager: true });
          globalScene.eventTarget.dispatchEvent(new GameOverEvent());
          this.end();
        });
      });
    };

    if (this.endCardPhase) {
      ui.fadeOut(500).then(() => {
        ui.getMessageHandler()?.bg.setVisible(true);

        this.endCardPhase?.endCard.destroy();
        this.endCardPhase?.text.destroy();
        saveAndReset();
      });
    } else {
      saveAndReset();
    }
  }
}
