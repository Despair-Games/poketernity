// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { GameOverPhase } from "#app/phases/game-over-phase";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports--

import { EVIL_BOSS_2_WAVE } from "#app/data/special-waves";
import { globalScene } from "#app/global-scene";
import type { CustomModifierSettings } from "#app/modifier/modifier-type";
import { modifierTypes } from "#app/modifier/modifier-types";
import { PokemonPhase } from "#app/phases/abstract-pokemon-phase";
import { BattleEndPhase } from "#app/phases/battle-end-phase";
import { EggLapsePhase } from "#app/phases/egg-lapse-phase";
import { ModifierRewardPhase } from "#app/phases/modifier-reward-phase";
import { NewBattlePhase } from "#app/phases/new-battle-phase";
import { SelectModifierPhase } from "#app/phases/select-modifier-phase";
import { TrainerVictoryPhase } from "#app/phases/trainer-victory-phase";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattleType } from "#enums/battle-type";
import type { BattlerIndex } from "#enums/battler-index";
import { PhaseId } from "#enums/phase-id";

/**
 * Handles various effects when the player clears a wave:
 * - Clears "delayed attack" arena tags (Future Sight / Doom Desire)
 * - Pushes a {@linkcode BattleEndPhase}
 * - Pushes a {@linkcode TrainerVictoryPhase} if this was a trainer battle
 * - If this was the final wave in a non-Endless mode, pushes a {@linkcode GameOverPhase} and ends the current phase
 * - Pushes an {@linkcode EggLapsePhase}
 * - Gives item rewards based on wave and game mode
 * - Pushes a {@linkcode NewBattlePhase}
 */
export class VictoryPhase extends PokemonPhase {
  override readonly id = PhaseId.VICTORY;

  constructor(battlerIndex: BattlerIndex | number) {
    super(battlerIndex);
  }

  public override start(): void {
    super.start();

    const { currentBattle, gameMode, phaseManager } = globalScene;
    const { battleType, waveIndex } = currentBattle;
    const { isClassic, isDaily, isEndless } = gameMode;

    // clear all queued delayed attacks (e.g. from Future Sight)
    globalScene.arena.removeTag(ArenaTagType.DELAYED_ATTACK);

    phaseManager.pushPhase(new BattleEndPhase(true));

    if (battleType === BattleType.TRAINER) {
      phaseManager.pushPhase(new TrainerVictoryPhase());
    }

    if (!isEndless && gameMode.isWaveFinal(waveIndex)) {
      currentBattle.battleType = BattleType.CLEAR;
      globalScene.score += gameMode.getClearScoreBonus();
      globalScene.updateScoreText();
      phaseManager.queueGameOverPhase({ isVictory: true });
      return super.end();
    }

    phaseManager.pushPhase(new EggLapsePhase());

    if (isClassic && waveIndex === EVIL_BOSS_2_WAVE) {
      // Should get Lock Capsule on 165 before shop phase so it can be used in the rewards shop
      phaseManager.pushPhase(new ModifierRewardPhase(modifierTypes.LOCK_CAPSULE));
    }

    if (waveIndex % 10 > 0) {
      phaseManager.pushPhase(new SelectModifierPhase({ customModifierSettings: this.getFixedBattleCustomModifiers() }));
      return this.end();
    }
    if (isDaily) {
      phaseManager.pushPhase(new ModifierRewardPhase(modifierTypes.EXP_CHARM));

      if ([20, 30, 40].includes(waveIndex)) {
        phaseManager.pushPhase(new ModifierRewardPhase(modifierTypes.GOLDEN_POKEBALL));
      }

      return this.end();
    }

    if (isEndless) {
      if (waveIndex === 10) {
        phaseManager.pushPhase(new ModifierRewardPhase(modifierTypes.EXP_SHARE));
      }

      if (waveIndex <= 750 && (waveIndex <= 500 || waveIndex % 30 === 10)) {
        phaseManager.pushPhase(
          new ModifierRewardPhase(
            !(waveIndex % 30 === 10) || waveIndex > 250 ? modifierTypes.EXP_CHARM : modifierTypes.SUPER_EXP_CHARM,
          ),
        );
      }

      if (waveIndex % 50 === 0) {
        phaseManager.pushPhase(
          new ModifierRewardPhase(!(waveIndex % 250) ? modifierTypes.VOUCHER_PREMIUM : modifierTypes.VOUCHER_PLUS),
        );
      }
    } else {
      const modifierType = gameMode.isGymWave(waveIndex) ? modifierTypes.SUPER_EXP_CHARM : modifierTypes.EXP_CHARM;
      phaseManager.pushPhase(new ModifierRewardPhase(modifierType));
    }

    if ([50, 100, 150].includes(waveIndex)) {
      phaseManager.pushPhase(new ModifierRewardPhase(modifierTypes.GOLDEN_POKEBALL));
    }

    this.end();
  }

  public override end(): void {
    globalScene.phaseManager.pushPhase(new NewBattlePhase());
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
