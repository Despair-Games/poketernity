import { applyPostBattleAbAttrs, PostBattleAbAttr } from "#app/data/ability";
import { globalScene } from "#app/global-scene";
import { LapsingPersistentModifier, LapsingPokemonHeldItemModifier } from "#app/modifier/modifier";
import { BattlePhase } from "#app/phases/battle-phase";
import { GameOverPhase } from "#app/phases/game-over-phase";

/** Handles the effects that need to trigger after a battle ends (game stats updates, reducing item turn count, etc) */
export class BattleEndPhase extends BattlePhase {
  /** If true, will increment battles won */
  public isVictory: boolean;

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
      globalScene.clearPhaseQueue();
      globalScene.unshiftPhase(new GameOverPhase(true));
    }

    for (const pokemon of globalScene.getField()) {
      if (pokemon && pokemon.battleSummonData) {
        pokemon.battleSummonData.waveTurnCount = 1;
      }
    }

    for (const pokemon of globalScene.getPokemonAllowedInBattle()) {
      applyPostBattleAbAttrs(PostBattleAbAttr, pokemon, false, this.isVictory);
    }

    if (currentBattle.moneyScattered) {
      currentBattle.pickUpScatteredMoney();
    }

    globalScene.clearEnemyHeldItemModifiers();

    const lapsingModifiers = globalScene.findModifiers(
      (m) => m instanceof LapsingPersistentModifier || m instanceof LapsingPokemonHeldItemModifier,
    ) as (LapsingPersistentModifier | LapsingPokemonHeldItemModifier)[];
    for (const m of lapsingModifiers) {
      const args: any[] = [];
      if (m instanceof LapsingPokemonHeldItemModifier) {
        args.push(globalScene.getPokemonById(m.pokemonId));
      }
      if (!m.lapse(...args)) {
        globalScene.removeModifier(m);
      }
    }

    globalScene.updateModifiers().then(() => this.end());
  }
}
