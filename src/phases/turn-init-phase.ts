import {
  handleMysteryEncounterBattleStartEffects,
  handleMysteryEncounterTurnStartEffects,
} from "#app/data/mystery-encounters/utils/encounter-phase-utils";
import { TurnInitEvent } from "#app/events/battle-scene";
import type { PlayerPokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import i18next from "i18next";
import { FieldPhase } from "./abstract-field-phase";
import { CommandPhase } from "./command-phase";
import { EnemyCommandPhase } from "./enemy-command-phase";
import { GameOverPhase } from "./game-over-phase";
import { ToggleDoublePositionPhase } from "./toggle-double-position-phase";
import { TurnStartPhase } from "./turn-start-phase";

export class TurnInitPhase extends FieldPhase {
  public override start(): void {
    super.start();

    const { currentBattle } = globalScene;

    globalScene.getPlayerField().forEach((p) => {
      // If this pokemon is in play and evolved into something illegal under the current challenge, force a switch
      if (p.isOnField() && !p.isAllowedInBattle()) {
        globalScene.queueMessage(i18next.t("challenges:illegalEvolution", { pokemon: p.name }), null, true);

        const allowedPokemon = globalScene.getPokemonAllowedInBattle();

        if (!allowedPokemon.length) {
          // If there are no longer any legal pokemon in the party, game over.
          globalScene.clearPhaseQueue();
          globalScene.unshiftPhase(new GameOverPhase());
        } else if (
          allowedPokemon.length >= currentBattle.getBattlerCount()
          || (currentBattle.double && !allowedPokemon[0].isActive(true))
        ) {
          // If there is at least one pokemon in the back that is legal to switch in, force a switch.
          p.switchOut();
        } else {
          // If there are no pokemon in the back but we're not game overing, just hide the pokemon.
          // This should only happen in double battles.
          p.leaveField();
        }
        if (allowedPokemon.length === 1 && currentBattle.double) {
          globalScene.unshiftPhase(new ToggleDoublePositionPhase(true));
        }
      }
    });

    globalScene.eventTarget.dispatchEvent(new TurnInitEvent());

    handleMysteryEncounterBattleStartEffects();

    // If true, will skip remainder of current phase (and not queue CommandPhases etc.)
    if (handleMysteryEncounterTurnStartEffects()) {
      return this.end();
    }

    globalScene.getField().forEach((pokemon) => {
      const fieldIndex = pokemon.getFieldIndex();

      if (pokemon.isActive()) {
        if (pokemon.isPlayer()) {
          currentBattle.addParticipant(pokemon as PlayerPokemon);
        }

        pokemon.resetTurnData();

        globalScene.pushPhase(pokemon.isPlayer() ? new CommandPhase(fieldIndex) : new EnemyCommandPhase(fieldIndex));
      }
    });

    globalScene.pushPhase(new TurnStartPhase());

    this.end();
  }
}
