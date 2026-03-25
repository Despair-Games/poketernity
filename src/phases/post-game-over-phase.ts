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

  public override async start(): Promise<void> {
    const { gameData, sessionSlotId, ui } = globalScene;

    if (this.endCardPhase) {
      await ui.fadeOut(500);

      ui.getMessageHandler()?.bg.setVisible(true);

      this.endCardPhase?.endCard.destroy();
      this.endCardPhase?.text.destroy();
    }

    const saveSuccess = await gameData.saveAll(true, true, true);
    if (!saveSuccess) {
      return globalScene.reset(true);
    }

    const sessionClearSuccess = await gameData.tryClearSession(sessionSlotId);
    if (!sessionClearSuccess[0]) {
      return globalScene.reset(true);
    }

    globalScene.reset();
    globalScene.phaseManager.toTitleScreen({ eager: true });
    globalScene.eventTarget.dispatchEvent(new GameOverEvent());

    this.end();
  }
}
