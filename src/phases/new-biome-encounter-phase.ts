import { globalScene } from "#app/global-scene";
import { NextEncounterPhase } from "#phases/next-encounter-phase";

/**
 * Triggers the first encounter of a new biome.
 * @deprecated This is no longer used after Endless Mode's removal
 */
export class NewBiomeEncounterPhase extends NextEncounterPhase {
  public override readonly phaseName = "NewBiomeEncounterPhase";

  protected override doEncounter(): void {
    const { arenaEnemy, currentBattle, tweens } = globalScene;

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

    tweens.add({
      targets: moveTargets.flat(),
      x: "+=300",
      duration: 2000,
      onComplete: () => {
        if (currentBattle.isClassicFinalBoss) {
          this.displayFinalBossDialogue();
        } else {
          this.doEncounterCommon();
        }
      },
    });
  }

  /**
   * Set biome weather.
   */
  protected override trySetWeatherIfNewBiome(): void {
    globalScene.arena.setRandomWeather();
  }
}
