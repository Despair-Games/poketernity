import { globalScene } from "#app/global-scene";
import { BattlePhase } from "#phases/base/battle-phase";
import { fixedNumber } from "#utils/common-utils";

/** Fully heals the player's party. Usually occurs after every 10th wave. */
export class PartyHealPhase extends BattlePhase {
  public override readonly phaseName = "PartyHealPhase";

  private readonly resumeBgm: boolean;

  constructor(resumeBgm: boolean) {
    super();

    this.resumeBgm = resumeBgm;
  }

  public override async start(): Promise<void> {
    const { time, ui } = globalScene;

    const bgmPlaying = globalScene.audioManager.isBgmPlaying();
    if (bgmPlaying) {
      globalScene.audioManager.fadeOutBgm(1000, false);
    }

    await ui.fadeOut(1000);

    for (const pokemon of globalScene.getPlayerParty()) {
      pokemon.hp = pokemon.getMaxHp();
      pokemon.resetStatus();
      pokemon.restoreMovePP();
      pokemon.updateInfo(true);
    }
    globalScene.playerTerasUsed = 0;

    const healSong = globalScene.audioManager.playSoundWithoutBgm("heal");
    await new Promise((resolve) => time.delayedCall(fixedNumber(healSong.totalDuration * 1000), resolve));
    healSong.destroy();

    if (this.resumeBgm && bgmPlaying) {
      globalScene.audioManager.playBgm();
    }

    await ui.fadeIn(500);
    this.end();
  }
}
