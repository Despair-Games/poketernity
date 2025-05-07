import type { PostBattleAbAttr } from "#app/data/abilities/ab-attrs/post-battle-ab-attr";
import { applyAbAttrs } from "#app/data/abilities/apply-ab-attrs";
import { globalScene } from "#app/global-scene";
import type { LapsingPersistentModifier, LapsingPokemonHeldItemModifier } from "#app/modifier/modifier";
import { BattlePhase } from "#app/phases/abstract-battle-phase";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { PhaseId } from "#enums/phase-id";

/**
 * Handles the effects that need to trigger after a battle ends (game stats updates, reducing item turn count, etc)
 * @extends BattlePhase
 */
export class BattleEndPhase extends BattlePhase {
  override readonly id = PhaseId.BATTLE_END;
  /** If true, will increment battles won */
  public readonly isVictory: boolean;

  constructor(isVictory: boolean) {
    super();

    this.isVictory = isVictory;
  }

  public override start(): void {
    super.start();

    const { currentBattle, gameData, gameMode } = globalScene;

    gameData.gameStats.battles++;
    if (gameMode.isEndless && currentBattle.waveIndex + 1 > gameData.gameStats.highestEndlessWave) {
      gameData.gameStats.highestEndlessWave = currentBattle.waveIndex + 1;
    }

    // Endless graceful end
    if (gameMode.isEndless && currentBattle.waveIndex >= 5850) {
      globalScene.phaseManager.queueGameOverPhase({ clearPhaseQueue: true, isVictory: true });
    }

    for (const pokemon of globalScene.getField()) {
      if (pokemon && pokemon.summonData) {
        pokemon.summonData.waveTurnCount = 0;
      }
    }

    for (const pokemon of globalScene.getPokemonAllowedInBattle()) {
      applyAbAttrs<PostBattleAbAttr>(AbAttrFlag.POST_BATTLE, pokemon, false, this.isVictory);
    }

    if (this.isVictory) {
      currentBattle.addBattleScore();

      if (currentBattle.trainer) {
        gameData.gameStats.trainersDefeated++;
      }

      /**
       * Custom behavior that differs slightly from mainline
       * Will award money on defeating foe
       * Will award money on capturing foe
       * Will NOT award money on forcing foe to flee
       * Will NOT award money if foe flees
       */
      if (currentBattle.moneyScattered) {
        currentBattle.pickUpScatteredMoney();
      }
    }

    globalScene.clearEnemyHeldItemModifiers();

    for (const p of globalScene.getEnemyParty()) {
      try {
        p.destroy();
      } catch {
        console.warn("Unable to destroy stale pokemon object in BattleEndPhase:", p);
      }
    }

    const lapsingModifiers = globalScene.findModifiers(
      (m) => m.isLapsingPersistentModifier() || m.isLapsingPokemonHeldItemModifier(),
    ) as (LapsingPersistentModifier | LapsingPokemonHeldItemModifier)[];
    for (const m of lapsingModifiers) {
      const args: any[] = [];
      if (m.isLapsingPokemonHeldItemModifier()) {
        args.push(globalScene.getPokemonById(m.pokemonId));
      }
      if (!m.lapse(...args)) {
        globalScene.removeModifier(m);
      }
    }

    globalScene.updateModifiers();
    this.end();
  }
}
