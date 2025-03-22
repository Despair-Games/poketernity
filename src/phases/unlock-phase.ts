import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { getUnlockableName } from "#app/system/unlockables";
import { PhaseId } from "#enums/phase-id";
import { type Unlockables } from "#enums/unlockables";
import i18next from "i18next";

export class UnlockPhase extends Phase {
  override readonly id = PhaseId.UNLOCK;
  private readonly unlockable: Unlockables;

  constructor(unlockable: Unlockables) {
    super();

    this.unlockable = unlockable;
  }

  public override start(): void {
    const { arenaBg, gameData, time, ui } = globalScene;

    time.delayedCall(2000, () => {
      gameData.unlocks[this.unlockable] = true;
      // Sound loaded into game as is
      globalScene.audioManager.playSound("level_up_fanfare");
      ui.setMessageMode();
      ui.showText(
        i18next.t("battle:unlockedSomething", { unlockedThing: getUnlockableName(this.unlockable) }),
        null,
        () => {
          time.delayedCall(1500, () => arenaBg.setVisible(true));
          this.end();
        },
        null,
        true,
        1500,
      );
    });
  }
}
