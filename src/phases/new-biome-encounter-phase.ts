import { PostBiomeChangeAbAttr } from "#app/data/ab-attrs/post-biome-change-ab-attr";
import { applyAbAttrs } from "#app/data/ability";
import { getRandomWeatherType } from "#app/data/weather";
import { globalScene } from "#app/global-scene";
import { NextEncounterPhase } from "./next-encounter-phase";

/**
 * Triggers the first encounter of a new biome
 * @extends NextEncounterPhase
 */
export class NewBiomeEncounterPhase extends NextEncounterPhase {
  protected override doEncounter(): void {
    const { arenaEnemy, currentBattle, tweens } = globalScene;

    globalScene.playBgm(undefined, true);

    for (const pokemon of globalScene.getPlayerParty()) {
      if (pokemon) {
        pokemon.resetBattleData();
      }
    }

    for (const pokemon of globalScene.getPlayerParty().filter((p) => p.isOnField())) {
      applyAbAttrs(PostBiomeChangeAbAttr, pokemon, null);
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
    globalScene.arena.trySetWeather(getRandomWeatherType(globalScene.arena), false);
  }
}
