import type { PlayerPokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { PlayerPartyMemberPokemonPhase } from "#app/phases/abstract-player-party-member-pokemon-phase";
import { EvolutionPhase } from "#app/phases/evolution-phase";
import { LearnMovePhase } from "#app/phases/learn-move-phase";
import { LevelAchv } from "#app/system/achv";
import { NumberHolder } from "#app/utils";
import { ExpNotification } from "#enums/exp-notification";
import i18next from "i18next";

/**
 * Handles the effects of a pokemon levelling up:
 * - Validates the {@linkcode LevelAchv} achievement
 * - Updates and displays the pokemon's stats
 * - Plays the level up SFX
 * - Displays the appropriate messages
 * - Pushes a {@linkcode LearnMovePhase} for each newly learned move
 * - Pushes an {@linkcode EvolutionPhase} if the pokemon should evolve
 *
 * @extends PlayerPartyMemberPokemonPhase
 */
export class LevelUpPhase extends PlayerPartyMemberPokemonPhase {
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
    const { expParty, gameData, ui } = globalScene;

    if (this.level > gameData.gameStats.highestLevel) {
      gameData.gameStats.highestLevel = this.level;
    }

    globalScene.validateAchvs(LevelAchv, new NumberHolder(this.level));

    const prevStats = this.pokemon.stats.slice(0);
    this.pokemon.calculateStats();
    this.pokemon.updateInfo();

    const promptLevelUpStats = (): Promise<void> =>
      ui
        .getMessageHandler()
        .promptLevelUpStats(this.partyMemberIndex, prevStats, false)
        .then(() => this.end());

    if (expParty === ExpNotification.DEFAULT) {
      globalScene.playSound("level_up_fanfare");

      const levelUpText = i18next.t("battle:levelUp", {
        pokemonName: getPokemonNameWithAffix(this.pokemon),
        level: this.level,
      });
      ui.showText(levelUpText, null, () => promptLevelUpStats(), null, true);
    } else if (expParty === ExpNotification.SKIP) {
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
      for (const lm of levelMoves) {
        globalScene.unshiftPhase(new LearnMovePhase(this.partyMemberIndex, lm[1]));
      }
    }

    if (!this.pokemon.pauseEvolutions) {
      const evolution = this.pokemon.getEvolution();
      if (evolution) {
        globalScene.unshiftPhase(new EvolutionPhase(this.pokemon, evolution, this.lastLevel));
      }
    }

    return super.end();
  }
}
