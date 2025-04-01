import { FRIENDSHIP_GAIN_PER_WAVE } from "#app/constants";
import { globalScene } from "#app/global-scene";
import { PhaseId } from "#enums/phase-id";
import { EncounterPhase } from "./encounter-phase";

/**
 * Triggers the next encounter (no biome change)
 * @extends EncounterPhase
 */
export class NextEncounterPhase extends EncounterPhase {
  /** @override **Must** use generic {@linkcode PhaseId} since {@linkcode NextEncounterPhase} is extended by other phases */
  override readonly id: PhaseId = PhaseId.NEXT_ENCOUNTER;

  protected override doEncounter(): void {
    const { arena, arenaEnemy, arenaNextEnemy, currentBattle, field, lastEnemyTrainer, lastMysteryEncounter, tweens } =
      globalScene;
    const { isClassicFinalBoss, mysteryEncounter, trainer } = currentBattle;

    globalScene.audioManager.playBgm(undefined, true);

    for (const pokemon of globalScene.getPlayerParty()) {
      if (pokemon) {
        pokemon.resetBattleData();
        /**
         * TODO: Known bug where this gets called after the session has been saved so
         * reloading a session will cause this 1 friendship gain to be lost. See
         * https://github.com/Despair-Games/poketernity/issues/395
         */
        if (!pokemon.isFainted()) {
          pokemon.addFriendship(FRIENDSHIP_GAIN_PER_WAVE);
        }
      }
    }

    arenaNextEnemy.setBiome(arena.biomeId);
    arenaNextEnemy.setVisible(true);

    const enemyField = globalScene.getEnemyField();
    const moveTargets: any[] = [arenaEnemy, arenaNextEnemy, trainer, enemyField, lastEnemyTrainer];

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
        arenaEnemy.setBiome(arena.biomeId);
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

        if (isClassicFinalBoss) {
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
