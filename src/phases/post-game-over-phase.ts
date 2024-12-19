import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import type { EndCardPhase } from "./end-card-phase";
import { TitlePhase } from "./title-phase";

export class PostGameOverPhase extends Phase {
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
          globalScene.unshiftPhase(new TitlePhase());
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
