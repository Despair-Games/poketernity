import { globalScene } from "#app/global-scene";
import { genOneThroughFourExpFormula } from "#data/exp";
import { BattleType } from "#enums/battle-type";
import type { FieldBattlerIndex } from "#enums/battler-index";
import { PhaseId } from "#enums/phase-id";
import { handleMysteryEncounterVictory } from "#mystery-encounters/encounter-phase-utils";
import { PokemonPhase } from "#phases/abstract-pokemon-phase";
import { VictoryPhase } from "#phases/victory-phase";

/**
 * Handles the actions after the player KOs a pokemon:
 * - Increases {@linkcode globalScene.gameData.gameStats.pokemonDefeated | pokemon defeated} count in game stats
 * - Applies EXP gain
 * - If this is a Mystery Encounter: hand off to a ME function and end the phase
 * - If there are no more unfainted pokemon on the enemy team, unshift a {@linkcode VictoryPhase}
 */
export class PostKnockoutPhase extends PokemonPhase {
  public override readonly id: PhaseId = PhaseId.POST_KNOCKOUT;
  /**
   * If `true`, indicates that the phase is intended for EXP purposes only, and not to continue a battle to next phase.
   * Only used by Mystery Encounters.
   */
  public readonly isExpOnly: boolean;

  constructor(battlerIndex: FieldBattlerIndex | number, isExpOnly: boolean = false) {
    super(battlerIndex);

    this.isExpOnly = isExpOnly;
  }

  public override start(): void {
    const { currentBattle, gameData, phaseManager } = globalScene;
    const { battleType, mysteryEncounter } = currentBattle;

    const isMysteryEncounter = currentBattle.isBattleMysteryEncounter();

    // update Pokemon defeated count except for MEs that disable it
    if (!isMysteryEncounter || !mysteryEncounter?.preventGameStatsUpdates) {
      gameData.gameStats.pokemonDefeated++;
    }

    const expValue = genOneThroughFourExpFormula(this.getPokemon());
    globalScene.applyPartyExp(expValue, true);

    if (isMysteryEncounter) {
      handleMysteryEncounterVictory(false, this.isExpOnly);
      return this.end();
    }

    // If any enemy Pokemon are still alive on the field or waiting for its fainting animation, do not advance a wave.
    // Also, if the enemy is a Trainer with other Pokemon alive in their party backline, do not advance a wave.
    if (
      !globalScene
        .getEnemyParty()
        .some((p) => p && (p.isOnField() || (battleType !== BattleType.WILD && !p.isFainted())))
    ) {
      phaseManager.unshiftPhase(new VictoryPhase(this.battlerIndex));
    }

    this.end();
  }
}
