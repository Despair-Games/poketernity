import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { FRIENDSHIP_GAIN_PER_LEVEL_UP } from "#constants/friendship-constants";
import { ExpNotification } from "#enums/exp-notification";
import type { PlayerPokemon } from "#field/player-pokemon";
import { PlayerPartyMemberPokemonPhase } from "#phases/base/player-party-member-pokemon-phase";
import { settings } from "#system/settings-manager";
import i18next from "i18next";

/**
 * Handles the effects of a pokemon levelling up:
 * - Validates the {@linkcode LevelAchv} achievement
 * - Updates and displays the pokemon's stats
 * - Plays the level up SFX
 * - Displays the appropriate messages
 * - Pushes a {@linkcode LearnMovePhase} for each newly learned move
 * - Pushes an {@linkcode EvolutionPhase} if the pokemon should evolve
 */
export class LevelUpPhase extends PlayerPartyMemberPokemonPhase {
  public override readonly phaseName = "LevelUpPhase";

  protected readonly lastLevel: number;
  protected readonly level: number;
  protected readonly pokemon: PlayerPokemon = this.getPlayerPokemon();

  constructor(partyMemberIndex: number, lastLevel: number, level: number) {
    super(partyMemberIndex);

    this.lastLevel = lastLevel;
    this.level = level;
  }

  public override start(): void {
    super.start();
    const { gameData, ui } = globalScene;

    if (this.level > gameData.gameStats.highestLevel) {
      gameData.gameStats.highestLevel = this.level;
    }

    const prevStats = this.pokemon.stats.slice(0);
    this.pokemon.calculateStats();
    this.pokemon.addFriendship(FRIENDSHIP_GAIN_PER_LEVEL_UP);
    this.pokemon.updateInfo();

    // Retrieve the messageUiHandler to display level up stats
    const messageUiHandler = ui.getMessageHandler();
    if (!messageUiHandler) {
      this.end();
      return;
    }

    const promptLevelUpStats = (): Promise<void> =>
      messageUiHandler.promptLevelUpStats(this.partyMemberIndex, prevStats, false).then(() => this.end());

    if (settings.general.partyExpNotificationMode === ExpNotification.DEFAULT) {
      globalScene.audioManager.playSound("level_up_fanfare");

      const levelUpText = i18next.t("battle:levelUp", {
        pokemonName: getPokemonNameWithAffix(this.pokemon),
        level: this.level,
      });
      ui.showText(levelUpText, null, () => promptLevelUpStats(), null, true);
    } else if (settings.general.partyExpNotificationMode === ExpNotification.SKIP) {
      this.end();
    } else {
      // we still want to display the stats if activated
      promptLevelUpStats();
    }
  }

  public override end(): void {
    // this feels like an unnecessary optimization
    if (this.lastLevel < 100) {
      const levelMoves = this.getPokemon().getLevelMoves(this.lastLevel + 1);
      for (const [, learnMoveId] of levelMoves) {
        globalScene.phaseManager.createAndUnshiftPhase("LearnMovePhase", this.partyMemberIndex, learnMoveId);
      }
    }

    if (!this.pokemon.pauseEvolutions) {
      const evolution = this.pokemon.getEvolution();
      if (evolution) {
        globalScene.phaseManager.createAndUnshiftPhase("EvolutionPhase", this.pokemon, evolution, this.lastLevel);
      }
    }

    super.end();
  }
}
