/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type MysteryEncounter from "#mystery-encounters/mystery-encounter";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";

/**
 * Will handle (in order):
 * - {@linkcode MysteryEncounter.doContinueEncounter()} callback for continuous encounters with back-to-back battles (this should push/shift its own phases as needed)
 *
 * OR
 *
 * - Any encounter reward logic that is set within {@linkcode MysteryEncounter.doEncounterExp}
 * - Any encounter reward logic that is set within {@linkcode MysteryEncounter.doEncounterRewards}
 * - Otherwise, can add a no-reward-item shop with only Potions, etc. if addHealPhase is true
 * - Queuing of the {@linkcode PostMysteryEncounterPhase}
 */
export class MysteryEncounterRewardsPhase extends Phase {
  public override readonly phaseName = "MysteryEncounterRewardsPhase";

  protected addHealPhase: boolean;

  constructor(addHealPhase: boolean = false) {
    super();
    this.addHealPhase = addHealPhase;
  }

  /**
   * Runs {@linkcode MysteryEncounter.doContinueEncounter} and ends phase, OR {@linkcode MysteryEncounter.onRewards} then continues encounter
   */
  public override start(): void {
    super.start();

    const encounter = globalScene.currentBattle.mysteryEncounter!; // TODO: Resolve bang?

    if (encounter.doContinueEncounter) {
      encounter.doContinueEncounter().then(() => {
        this.end();
      });
    } else {
      globalScene.executeWithSeedOffset(() => {
        if (encounter.onRewards) {
          encounter.onRewards().then(() => {
            this.doEncounterRewardsAndContinue();
          });
        } else {
          this.doEncounterRewardsAndContinue();
        }
        // Do not use ME's seedOffset for rewards, these should always be consistent with waveIndex (once per wave)
      }, globalScene.currentBattle.waveIndex * 1000);
    }
  }

  /**
   * Queues encounter EXP and rewards phases, {@linkcode PostMysteryEncounterPhase}, and ends phase
   */
  protected doEncounterRewardsAndContinue(): void {
    const encounter = globalScene.currentBattle.mysteryEncounter!; // TODO: Resolve bang?

    if (encounter.doEncounterExp) {
      encounter.doEncounterExp();
    }

    if (encounter.doEncounterRewards) {
      encounter.doEncounterRewards();
    } else if (this.addHealPhase) {
      globalScene.phaseManager.tryRemovePhase((p) => p.is("SelectModifierPhase"));
      globalScene.phaseManager.createAndUnshiftPhase("SelectModifierPhase", {
        customModifierSettings: { fillRemaining: false, rerollMultiplier: -1 },
      });
    }

    globalScene.phaseManager.createAndPushPhase("PostMysteryEncounterPhase");
    this.end();
  }
}
