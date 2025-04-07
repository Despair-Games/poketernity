import { type BattlerIndex } from "#enums/battler-index";
import { BattleType } from "#enums/battle-type";
import { handleMysteryEncounterVictory } from "#app/data/mystery-encounters/utils/encounter-phase-utils";
import { globalScene } from "#app/global-scene";
import { type CustomModifierSettings } from "#app/modifier/modifier-type";
import { modifierTypes } from "#app/modifier/modifier-types";
import { PokemonPhase } from "./abstract-pokemon-phase";
import { BattleEndPhase } from "./battle-end-phase";
import { EggLapsePhase } from "./egg-lapse-phase";
import { ModifierRewardPhase } from "./modifier-reward-phase";
import { NewBattlePhase } from "./new-battle-phase";
import { SelectModifierPhase } from "./select-modifier-phase";
import { TrainerVictoryPhase } from "./trainer-victory-phase";
import { ArenaTagType } from "#enums/arena-tag-type";
import { EVIL_BOSS_2_WAVE } from "#app/data/special-waves";
import { PhaseId } from "#enums/phase-id";

export class VictoryPhase extends PokemonPhase {
  override readonly id = PhaseId.VICTORY;
  /** If true, indicates that the phase is intended for EXP purposes only, and not to continue a battle to next phase */
  public readonly isExpOnly: boolean;

  constructor(battlerIndex: BattlerIndex | number, isExpOnly: boolean = false) {
    super(battlerIndex);

    this.isExpOnly = isExpOnly;
  }

  public override start(): void {
    super.start();

    const { currentBattle, gameData, gameMode, offsetGym } = globalScene;
    const { battleType, mysteryEncounter, waveIndex } = currentBattle;
    const { isClassic, isDaily, isEndless } = gameMode;

    const isMysteryEncounter = currentBattle.isBattleMysteryEncounter();

    // update Pokemon defeated count except for MEs that disable it
    if (!isMysteryEncounter || !mysteryEncounter?.preventGameStatsUpdates) {
      gameData.gameStats.pokemonDefeated++;
    }

    const expValue = this.getPokemon().getExpValue();
    globalScene.applyPartyExp(expValue, true);

    if (isMysteryEncounter) {
      handleMysteryEncounterVictory(false, this.isExpOnly);
      return this.end();
    }

    if (!globalScene.getEnemyParty().find((p) => (battleType === BattleType.WILD ? p.isOnField() : !p?.isFainted()))) {
      // clear all queued delayed attacks (e.g. from Future Sight)
      globalScene.arena.removeTag(ArenaTagType.DELAYED_ATTACK);

      globalScene.phaseManager.pushPhase(new BattleEndPhase(true));

      if (battleType === BattleType.TRAINER) {
        globalScene.phaseManager.pushPhase(new TrainerVictoryPhase());
      }

      if (isEndless || !gameMode.isWaveFinal(waveIndex)) {
        globalScene.phaseManager.pushPhase(new EggLapsePhase());

        if (isClassic && waveIndex === EVIL_BOSS_2_WAVE) {
          // Should get Lock Capsule on 165 before shop phase so it can be used in the rewards shop
          globalScene.phaseManager.pushPhase(new ModifierRewardPhase(modifierTypes.LOCK_CAPSULE));
        }

        if (waveIndex % 10) {
          globalScene.phaseManager.pushPhase(
            new SelectModifierPhase({ customModifierSettings: this.getFixedBattleCustomModifiers() }),
          );
        } else if (isDaily) {
          globalScene.phaseManager.pushPhase(new ModifierRewardPhase(modifierTypes.EXP_CHARM));

          if (waveIndex > 10 && !gameMode.isWaveFinal(waveIndex)) {
            globalScene.phaseManager.pushPhase(new ModifierRewardPhase(modifierTypes.GOLDEN_POKEBALL));
          }
        } else {
          const superExpWave = !isEndless ? (offsetGym ? 0 : 20) : 10;
          if (isEndless && waveIndex === 10) {
            globalScene.phaseManager.pushPhase(new ModifierRewardPhase(modifierTypes.EXP_SHARE));
          }

          if (waveIndex <= 750 && (waveIndex <= 500 || waveIndex % 30 === superExpWave)) {
            globalScene.phaseManager.pushPhase(
              new ModifierRewardPhase(
                waveIndex % 30 !== superExpWave || waveIndex > 250
                  ? modifierTypes.EXP_CHARM
                  : modifierTypes.SUPER_EXP_CHARM,
              ),
            );
          }

          if (waveIndex <= 150 && !(waveIndex % 50)) {
            globalScene.phaseManager.pushPhase(new ModifierRewardPhase(modifierTypes.GOLDEN_POKEBALL));
          }

          if (isEndless && !(waveIndex % 50)) {
            globalScene.phaseManager.pushPhase(
              new ModifierRewardPhase(!(waveIndex % 250) ? modifierTypes.VOUCHER_PREMIUM : modifierTypes.VOUCHER_PLUS),
            );
          }
        }

        globalScene.phaseManager.pushPhase(new NewBattlePhase());
      } else {
        currentBattle.battleType = BattleType.CLEAR;
        globalScene.score += gameMode.getClearScoreBonus();
        globalScene.updateScoreText();
        globalScene.phaseManager.queueGameOverPhase({ isVictory: true });
      }
    }

    this.end();
  }

  /**
   * If this wave is a fixed battle with special custom modifier rewards,
   * will pass those settings to the upcoming {@linkcode SelectModifierPhase}`.
   */
  protected getFixedBattleCustomModifiers(): CustomModifierSettings | undefined {
    const gameMode = globalScene.gameMode;
    const waveIndex = globalScene.currentBattle.waveIndex;
    if (gameMode.isFixedBattle(waveIndex)) {
      return gameMode.getFixedBattle(waveIndex).customModifierRewardSettings;
    }

    return undefined;
  }
}
