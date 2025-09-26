import { getModeName } from "#app/game-mode";
import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { GameModes } from "#enums/game-modes";
import { Unlockables } from "#enums/unlockables";
import i18next from "i18next";

function getUnlockableName(unlockable: Unlockables) {
  switch (unlockable) {
    case Unlockables.CHALLENGE_MODE:
      return `${getModeName(GameModes.CHALLENGE)} Mode`; // TODO: proper i18n
    case Unlockables.MINI_BLACK_HOLE:
      return i18next.t("modifierType:ModifierType.MINI_BLACK_HOLE.name");
    case Unlockables.EVIOLITE:
      return i18next.t("modifierType:ModifierType.EVIOLITE.name");
  }
}

export class UnlockPhase extends Phase {
  public override readonly phaseName = "UnlockPhase";

  private readonly unlockable: Unlockables;

  constructor(unlockable: Unlockables) {
    super();

    this.unlockable = unlockable;
  }

  public override start(): void {
    const { arenaBg, gameData, time, ui } = globalScene;

    time.delayedCall(2000, () => {
      gameData.unlocks[this.unlockable] = true;
      globalScene.audioManager.playSound("level_up_fanfare");
      ui.setMessageMode();
      ui.showText(i18next.t("battle:unlockedSomething", { unlockedThing: getUnlockableName(this.unlockable) }), {
        callback: () => {
          time.delayedCall(1500, () => arenaBg.setVisible(true));
          this.end();
        },
        prompt: true,
        promptDelay: 1500,
      });
    });
  }
}
