import { BattleType, ClassicFixedBossWaves, type BattlerIndex } from "#app/battle";
import { handleMysteryEncounterVictory } from "#app/data/mystery-encounters/utils/encounter-phase-utils";
import { globalScene } from "#app/global-scene";
import { modifierTypes, type CustomModifierSettings } from "#app/modifier/modifier-type";
import { AddEnemyBuffModifierPhase } from "./add-enemy-buff-modifier-phase";
import { BattleEndPhase } from "./battle-end-phase";
import { EggLapsePhase } from "./egg-lapse-phase";
import { GameOverPhase } from "./game-over-phase";
import { ModifierRewardPhase } from "./modifier-reward-phase";
import { NewBattlePhase } from "./new-battle-phase";
import { PokemonPhase } from "./pokemon-phase";
import { SelectModifierPhase } from "./select-modifier-phase";
import { TrainerVictoryPhase } from "./trainer-victory-phase";

export class VictoryPhase extends PokemonPhase {
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

    if (
      !globalScene.getEnemyParty().find((p) => (battleType === BattleType.WILD ? p.isOnField() : !p?.isFainted(true)))
    ) {
      globalScene.pushPhase(new BattleEndPhase(true));

      if (battleType === BattleType.TRAINER) {
        globalScene.pushPhase(new TrainerVictoryPhase());
      }

      if (isEndless || !gameMode.isWaveFinal(waveIndex)) {
        globalScene.pushPhase(new EggLapsePhase());

        if (isClassic && waveIndex === ClassicFixedBossWaves.EVIL_BOSS_2) {
          // Should get Lock Capsule on 165 before shop phase so it can be used in the rewards shop
          globalScene.pushPhase(new ModifierRewardPhase(modifierTypes.LOCK_CAPSULE));
        }

        if (waveIndex % 10) {
          globalScene.pushPhase(new SelectModifierPhase(undefined, undefined, this.getFixedBattleCustomModifiers()));
        } else if (isDaily) {
          globalScene.pushPhase(new ModifierRewardPhase(modifierTypes.EXP_CHARM));

          if (waveIndex > 10 && !gameMode.isWaveFinal(waveIndex)) {
            globalScene.pushPhase(new ModifierRewardPhase(modifierTypes.GOLDEN_POKEBALL));
          }
        } else {
          const superExpWave = !isEndless ? (offsetGym ? 0 : 20) : 10;
          if (isEndless && waveIndex === 10) {
            globalScene.pushPhase(new ModifierRewardPhase(modifierTypes.EXP_SHARE));
          }

          if (waveIndex <= 750 && (waveIndex <= 500 || waveIndex % 30 === superExpWave)) {
            globalScene.pushPhase(
              new ModifierRewardPhase(
                waveIndex % 30 !== superExpWave || waveIndex > 250
                  ? modifierTypes.EXP_CHARM
                  : modifierTypes.SUPER_EXP_CHARM,
              ),
            );
          }

          if (waveIndex <= 150 && !(waveIndex % 50)) {
            globalScene.pushPhase(new ModifierRewardPhase(modifierTypes.GOLDEN_POKEBALL));
          }

          if (isEndless && !(waveIndex % 50)) {
            globalScene.pushPhase(
              new ModifierRewardPhase(!(waveIndex % 250) ? modifierTypes.VOUCHER_PREMIUM : modifierTypes.VOUCHER_PLUS),
            );
            globalScene.pushPhase(new AddEnemyBuffModifierPhase());
          }
        }

        globalScene.pushPhase(new NewBattlePhase());
      } else {
        currentBattle.battleType = BattleType.CLEAR;
        globalScene.score += gameMode.getClearScoreBonus();
        globalScene.updateScoreText();
        globalScene.pushPhase(new GameOverPhase(true));
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
