import { applyAbAttrs } from "#app/data/apply-ab-attrs";
import { getRandomWeatherType } from "#app/data/weather";
import { globalScene } from "#app/global-scene";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { PhaseId } from "#enums/phase-id";
import { NextEncounterPhase } from "./next-encounter-phase";

/**
 * Triggers the first encounter of a new biome
 * @extends NextEncounterPhase
 */
export class NewBiomeEncounterPhase extends NextEncounterPhase {
  override readonly id = PhaseId.NEW_BIOME_ENCOUNTER;

  protected override doEncounter(): void {
    const { arenaEnemy, currentBattle, tweens } = globalScene;

    globalScene.audioManager.playBgm(undefined, true);

    for (const pokemon of globalScene.getPlayerParty()) {
      if (pokemon) {
        pokemon.resetBattleData();
      }
    }

    for (const pokemon of globalScene.getPlayerParty().filter((p) => p.isOnField())) {
      applyAbAttrs(AbAttrFlag.POST_BIOME_CHANGE, pokemon, false);
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
