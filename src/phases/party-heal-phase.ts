import { globalScene } from "#app/global-scene";
import { BattlePhase } from "./battle-phase";

/**
 * Fully heals the player's party, usually occurs after every 10th wave
 * @extends BattlePhase
 */
export class PartyHealPhase extends BattlePhase {
  private readonly resumeBgm: boolean;

  constructor(resumeBgm: boolean) {
    super();

    this.resumeBgm = resumeBgm;
  }

  public override start(): void {
    super.start();
    const { time, ui } = globalScene;

    const bgmPlaying = globalScene.isBgmPlaying();
    if (bgmPlaying) {
      globalScene.fadeOutBgm(1000, false);
    }

    ui.fadeOut(1000).then(() => {
      for (const pokemon of globalScene.getPlayerParty()) {
        pokemon.hp = pokemon.getMaxHp();
        pokemon.resetStatus();
        for (const move of pokemon.moveset) {
          move.ppUsed = 0;
        }
        pokemon.updateInfo(true);
      }
      const healSong = globalScene.playSoundWithoutBgm("heal");
      time.delayedCall(healSong.totalDuration * 1000, () => {
        healSong.destroy();
        if (this.resumeBgm && bgmPlaying) {
          globalScene.playBgm();
        }
        ui.fadeIn(500).then(() => this.end());
      });
    });
  }
}
