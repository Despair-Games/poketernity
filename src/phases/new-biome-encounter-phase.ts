import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { PostBiomeChangeAbAttr } from "#abilities/post-biome-change-ab-attr";
import { globalScene } from "#app/global-scene";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { NextEncounterPhase } from "#phases/next-encounter-phase";

/**
 * Triggers the first encounter of a new biome
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

    for (const pokemon of globalScene.getPlayerParty().filter((p) => p.isOnField())) {
      applyAbAttrs<PostBiomeChangeAbAttr>(AbAttrFlag.POST_BIOME_CHANGE, pokemon, false);
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
