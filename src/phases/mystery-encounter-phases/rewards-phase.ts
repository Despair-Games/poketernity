import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { SelectModifierPhase } from "#app/phases/select-modifier-phase";
import { PostMysteryEncounterPhase } from "./post-mystery-encounter-phase";

/**
 * Will handle (in order):
 * - doContinueEncounter() callback for continuous encounters with back-to-back battles (this should push/shift its own phases as needed)
 *
 * OR
 *
 * - Any encounter reward logic that is set within {@linkcode MysteryEncounter.doEncounterExp}
 * - Any encounter reward logic that is set within {@linkcode MysteryEncounter.doEncounterRewards}
 * - Otherwise, can add a no-reward-item shop with only Potions, etc. if addHealPhase is true
 * - Queuing of the {@linkcode PostMysteryEncounterPhase}
 */
export class MysteryEncounterRewardsPhase extends Phase {
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
      globalScene.tryRemovePhase((p) => p instanceof SelectModifierPhase);
      globalScene.unshiftPhase(new SelectModifierPhase(0, undefined, { fillRemaining: false, rerollMultiplier: -1 }));
    }

    globalScene.pushPhase(new PostMysteryEncounterPhase());
    this.end();
  }
}
