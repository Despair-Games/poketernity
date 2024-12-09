import { globalScene } from "#app/global-scene";
import { EncounterPhase } from "./encounter-phase";

/**
 * Triggers the next encounter (no biome change)
 * @extends EncounterPhase
 */
export class NextEncounterPhase extends EncounterPhase {
  protected override doEncounter(): void {
    const { arena, arenaEnemy, arenaNextEnemy, currentBattle, field, lastEnemyTrainer, lastMysteryEncounter, tweens } =
      globalScene;
    const { mysteryEncounter } = currentBattle;

    globalScene.playBgm(undefined, true);

    for (const pokemon of globalScene.getPlayerParty()) {
      if (pokemon) {
        pokemon.resetBattleData();
      }
    }

    arenaNextEnemy.setBiome(arena.biomeType);
    arenaNextEnemy.setVisible(true);

    const enemyField = globalScene.getEnemyField();
    const moveTargets: any[] = [arenaEnemy, arenaNextEnemy, currentBattle.trainer, enemyField, lastEnemyTrainer];
    const lastEncounterVisuals = lastMysteryEncounter?.introVisuals;
    if (lastEncounterVisuals) {
      moveTargets.push(lastEncounterVisuals);
    }
    const nextEncounterVisuals = mysteryEncounter?.introVisuals;
    if (nextEncounterVisuals) {
      const enterFromRight = nextEncounterVisuals.enterFromRight;
      if (enterFromRight) {
        nextEncounterVisuals.x += 500;
        tweens.add({
          targets: nextEncounterVisuals,
          x: "-=200",
          duration: 2000,
        });
      } else {
        moveTargets.push(nextEncounterVisuals);
      }
    }

    tweens.add({
      targets: moveTargets.flat(),
      x: "+=300",
      duration: 2000,
      onComplete: () => {
        arenaEnemy.setBiome(arena.biomeType);
        arenaEnemy.setX(arenaNextEnemy.x);
        arenaEnemy.setAlpha(1);
        arenaNextEnemy.setX(arenaNextEnemy.x - 300);
        arenaNextEnemy.setVisible(false);
        if (lastEnemyTrainer) {
          lastEnemyTrainer.destroy();
        }
        if (lastEncounterVisuals) {
          field.remove(lastEncounterVisuals, true);
          if (lastMysteryEncounter) {
            lastMysteryEncounter.introVisuals = undefined;
          }
        }

        if (currentBattle.isClassicFinalBoss) {
          this.displayFinalBossDialogue();
        } else {
          this.doEncounterCommon();
        }
      },
    });
  }

  /**
   * Do nothing (since this is simply the next wave in the same biome).
   */
  protected override trySetWeatherIfNewBiome(): void {}
}
