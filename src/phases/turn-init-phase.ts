import { globalScene } from "#app/global-scene";
import { PhaseId } from "#enums/phase-id";
import { TurnInitEvent } from "#events/battle-scene";
import type { PlayerPokemon } from "#field/player-pokemon";
import {
  handleMysteryEncounterBattleStartEffects,
  handleMysteryEncounterTurnStartEffects,
} from "#mystery-encounters/encounter-phase-utils";
import { FieldPhase } from "#phases/abstract-field-phase";
import { CommandPhase } from "#phases/command-phase";
import { EnemyCommandPhase } from "#phases/enemy-command-phase";
import { ToggleDoublePositionPhase } from "#phases/toggle-double-position-phase";
import { TurnStartPhase } from "#phases/turn-start-phase";
import i18next from "i18next";

export class TurnInitPhase extends FieldPhase {
  override readonly id = PhaseId.TURN_INIT;

  public override start(): void {
    super.start();

    const { currentBattle } = globalScene;

    globalScene.getPlayerField().forEach((p) => {
      // If this pokemon is in play and evolved into something illegal under the current challenge, force a switch
      if (p.isOnField() && !p.isAllowedInBattle()) {
        globalScene.phaseManager.queueMessagePhase(
          i18next.t("challenges:illegalEvolution", { pokemon: p.name }),
          null,
          true,
        );

        const allowedPokemon = globalScene.getPokemonAllowedInBattle();

        if (!allowedPokemon.length) {
          // If there are no longer any legal pokemon in the party, game over.
          globalScene.phaseManager.queueGameOverPhase({ clearPhaseQueue: true });
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
          globalScene.phaseManager.unshiftPhase(new ToggleDoublePositionPhase(true));
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
        pokemon.summonData.turnCount++;
        pokemon.summonData.waveTurnCount++;

        globalScene.phaseManager.pushPhase(
          pokemon.isPlayer() ? new CommandPhase(fieldIndex) : new EnemyCommandPhase(fieldIndex),
        );
      }
    });

    globalScene.phaseManager.pushPhase(new TurnStartPhase());

    this.end();
  }
}
