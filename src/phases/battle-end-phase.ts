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

    if (this.isVictory) {
      currentBattle.addBattleScore();

      if (currentBattle.trainer) {
        gameData.gameStats.trainersDefeated++;
      }
    }

    // Endless graceful end
    if (gameMode.isEndless && currentBattle.waveIndex >= 5850) {
      globalScene.gameOver({ clearPhaseQueue: true, isVictory: true });
    }

    for (const pokemon of globalScene.getField()) {
      if (pokemon && pokemon.battleSummonData) {
        pokemon.battleSummonData.waveTurnCount = 0;
      }
    }

    for (const pokemon of globalScene.getPokemonAllowedInBattle()) {
      applyAbAttrs(AbAttrFlag.POST_BATTLE, pokemon, false, this.isVictory);
    }

    if (currentBattle.moneyScattered) {
      currentBattle.pickUpScatteredMoney();
    }

    globalScene.clearEnemyHeldItemModifiers();

    try {
      globalScene.getEnemyParty().forEach((p) => p.destroy());
    } catch {
      console.warn("Unable to destroy stale pokemon objects in BattleEndPhase.");
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
