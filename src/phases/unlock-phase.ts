import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { getUnlockableName } from "#app/system/unlockables";
import { type Unlockables } from "#enums/unlockables";
import { UiMode } from "#enums/ui-mode";
import i18next from "i18next";

export class UnlockPhase extends Phase {
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
      globalScene.playSound("level_up_fanfare");
      ui.setMode(UiMode.MESSAGE);
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
