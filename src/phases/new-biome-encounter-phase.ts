import { globalScene } from "#app/global-scene";
import { NextEncounterPhase } from "#phases/next-encounter-phase";
import { playTween } from "#utils/anim-utils";

/**
 * Triggers the first encounter of a new biome.
 * @deprecated This is no longer used after Endless Mode's removal
 */
export class NewBiomeEncounterPhase extends NextEncounterPhase {
  public override readonly phaseName = "NewBiomeEncounterPhase";

  protected override async doEncounter(): Promise<void> {
    const { arenaEnemy, currentBattle } = globalScene;

    globalScene.audioManager.playBgm(undefined, true);

    for (const pokemon of globalScene.getPlayerParty()) {
      if (pokemon) {
        pokemon.resetWaveData();
      }
    }

    const enemyField = globalScene.getEnemyField();
    const moveTargets: any[] = [arenaEnemy, enemyField];

    const mysteryEncounter = currentBattle?.mysteryEncounter?.introVisuals;
    if (mysteryEncounter) {
      moveTargets.push(mysteryEncounter);
    }

    await playTween({
      targets: moveTargets.flat(),
      x: "+=300",
      duration: 2000,
    });
    if (currentBattle.isClassicFinalBoss) {
      await this.displayFinalBossDialogue();
    } else {
      await this.doEncounterCommon();
    }
  }

  /**
   * Set biome weather.
   */
  protected override trySetWeatherIfNewBiome(): void {
    globalScene.arena.setRandomWeather();
  }
}
