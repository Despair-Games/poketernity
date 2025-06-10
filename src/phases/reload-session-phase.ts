import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { UiMode } from "#enums/ui-mode";
import type { SessionReloadModalUiHandler } from "#ui/session-reload-modal-ui-handler";
import { fixedNumber } from "#utils/common-utils";

export class ReloadSessionPhase extends Phase {
  public override readonly phaseName = "ReloadSessionPhase";

  private readonly systemDataStr?: string;

  constructor(systemDataStr?: string) {
    super();

    this.systemDataStr = systemDataStr;
  }

  public override start(): void {
    const { gameData, time, ui } = globalScene;

    ui.setMode<SessionReloadModalUiHandler>(UiMode.SESSION_RELOAD);

    let delayElapsed = false;
    let loaded = false;

    time.delayedCall(fixedNumber(1500), () => {
      if (loaded) {
        this.end();
      } else {
        delayElapsed = true;
      }
    });

    gameData.clearLocalData();

    (this.systemDataStr ? gameData.initSystem(this.systemDataStr) : gameData.loadSystem()).then(() => {
      if (delayElapsed) {
        this.end();
      } else {
        loaded = true;
      }
    });
  }
}
