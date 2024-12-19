import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { Mode } from "#app/ui/ui";

export class ReloadSessionPhase extends Phase {
  private readonly systemDataStr?: string;

  constructor(systemDataStr?: string) {
    super();

    this.systemDataStr = systemDataStr;
  }

  public override start(): void {
    const { gameData, time, ui } = globalScene;

    ui.setMode(Mode.SESSION_RELOAD);

    let delayElapsed = false;
    let loaded = false;

    time.delayedCall(1500, () => {
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
