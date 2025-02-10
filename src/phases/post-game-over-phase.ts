import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { PhaseId } from "#enums/phase-id";
import type { EndCardPhase } from "./end-card-phase";

export class PostGameOverPhase extends Phase {
  override readonly id = PhaseId.POST_GAME_OVER;

  private readonly endCardPhase?: EndCardPhase;

  constructor(endCardPhase?: EndCardPhase) {
    super();

    this.endCardPhase = endCardPhase;
  }

  public override start(): void {
    super.start();
    const { gameData, sessionSlotId, ui } = globalScene;

    const saveAndReset = (): void => {
      gameData.saveAll(true, true, true).then((success) => {
        if (!success) {
          return globalScene.reset(true);
        }
        gameData.tryClearSession(sessionSlotId).then((success: boolean | [boolean, boolean]) => {
          if (!success[0]) {
            return globalScene.reset(true);
          }
          globalScene.reset();
          globalScene.toTitleScreen({ eager: true });
          this.end();
        });
      });
    };

    if (this.endCardPhase) {
      ui.fadeOut(500).then(() => {
        ui.getMessageHandler().bg.setVisible(true);

        this.endCardPhase?.endCard.destroy();
        this.endCardPhase?.text.destroy();
        saveAndReset();
      });
    } else {
      saveAndReset();
    }
  }
}
