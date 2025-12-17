import { globalScene } from "#app/global-scene";
import { EVIL_BOSS_2_WAVE } from "#constants/wave-constants";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattleType } from "#enums/battle-type";
import type { CustomModifierSettings } from "#modifier/modifier-type";
import { modifierTypes } from "#modifier/modifier-types";
import { PokemonPhase } from "#phases/base/pokemon-phase";
import type { GameOverPhase } from "#phases/game-over-phase";

/**
 * Handles various effects when the player clears a wave:
 * - Clears "delayed attack" arena tags (Future Sight / Doom Desire)
 * - Pushes a {@linkcode BattleEndPhase}
 * - Pushes a {@linkcode TrainerVictoryPhase} if this was a trainer battle
 * - If this was the final wave, pushes a {@linkcode GameOverPhase} and ends the current phase
 * - Pushes an {@linkcode EggLapsePhase}
 * - Gives item rewards based on wave and game mode
 * - Pushes a {@linkcode NewBattlePhase}
 */
export class VictoryPhase extends PokemonPhase {
  public override readonly phaseName = "VictoryPhase";

  public override start(): void {
    const { currentBattle, gameMode, phaseManager } = globalScene;
    const { battleType, waveIndex } = currentBattle;
    const { isClassic, isDaily } = gameMode;

    // clear all queued delayed attacks (e.g. from Future Sight)
    globalScene.arena.removeTag(ArenaTagType.DELAYED_ATTACK);

    phaseManager.createAndPushPhase("BattleEndPhase", true);

    if (battleType === BattleType.TRAINER) {
      phaseManager.createAndPushPhase("TrainerVictoryPhase");
    }

    if (gameMode.isWaveFinal(waveIndex)) {
      currentBattle.battleType = BattleType.CLEAR;
      globalScene.score += gameMode.getClearScoreBonus();
      globalScene.updateScoreText();
      phaseManager.queueGameOverPhase({ isVictory: true });
      super.end();
      return;
    }

    phaseManager.createAndPushPhase("EggLapsePhase");

    if (isClassic && waveIndex === EVIL_BOSS_2_WAVE) {
      // Should get Lock Capsule on 165 before shop phase so it can be used in the rewards shop
      phaseManager.createAndPushPhase("ModifierRewardPhase", modifierTypes.LOCK_CAPSULE);
    }

    if (waveIndex % 10 > 0) {
      phaseManager.createAndPushPhase("SelectModifierPhase", {
        customModifierSettings: this.getFixedBattleCustomModifiers(),
      });
      this.end();
      return;
    }
    if (isDaily) {
      phaseManager.createAndPushPhase("ModifierRewardPhase", modifierTypes.EXP_CHARM);

      if ([20, 30, 40].includes(waveIndex)) {
        phaseManager.createAndPushPhase("ModifierRewardPhase", modifierTypes.GOLDEN_POKEBALL);
      }

      this.end();
      return;
    }

    const expCharmType = gameMode.isGymWave(waveIndex) ? modifierTypes.SUPER_EXP_CHARM : modifierTypes.EXP_CHARM;
    phaseManager.createAndPushPhase("ModifierRewardPhase", expCharmType);

    if ([50, 100, 150].includes(waveIndex)) {
      phaseManager.createAndPushPhase("ModifierRewardPhase", modifierTypes.GOLDEN_POKEBALL);
    }

    this.end();
  }

  public override end(): void {
    globalScene.phaseManager.createAndPushPhase("NewBattlePhase");
    super.end();
  }

  /**
   * If this wave is a fixed battle with special custom modifier rewards,
   * pass those settings to the upcoming {@linkcode SelectModifierPhase}.
   */
  protected getFixedBattleCustomModifiers(): CustomModifierSettings | undefined {
    const gameMode = globalScene.gameMode;
    const waveIndex = globalScene.currentBattle.waveIndex;
    if (gameMode.isFixedBattle(waveIndex)) {
      return gameMode.getFixedBattle(waveIndex).customModifierRewardSettings;
    }
  }
}
