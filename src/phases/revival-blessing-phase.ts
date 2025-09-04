/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { FaintPhase } from "#phases/faint-phase";
import type { SwitchPhase } from "#phases/switch-phase";
import type { TurnEndPhase } from "#phases/turn-end-phase";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import { globalScene } from "#app/global-scene";
import { BattlerIndex } from "#enums/battler-index";
import { FieldPosition } from "#enums/field-position";
import { PartyUiMode } from "#enums/party-ui-mode";
import { SwitchType } from "#enums/switch-type";
import { UiMode } from "#enums/ui-mode";
import type { PlayerPokemon } from "#field/player-pokemon";
import type { Pokemon } from "#field/pokemon";
import { BattlePhase } from "#phases/base/battle-phase";
import type { PartyUiHandler } from "#ui/party-ui-handler";
import { isNil, toDmgValue } from "#utils/common-utils";
import { PartyFilterFainted } from "#utils/party-ui-utils";
import i18next from "i18next";

/**
 * Sets the Party UI and handles the effect of Revival Blessing
 * when used by one of the player's Pokemon.
 */
export class RevivalBlessingPhase extends BattlePhase {
  public override readonly phaseName = "RevivalBlessingPhase";

  protected readonly user: PlayerPokemon;

  constructor(user: PlayerPokemon) {
    super();

    this.user = user;
  }

  public override start(): void {
    globalScene.ui.setMode<PartyUiHandler>(
      UiMode.PARTY,
      PartyUiMode.REVIVAL_BLESSING,
      this.user.getFieldIndex(),
      (slotIndex: number) => this.revivePokemonAtSlotIndex(slotIndex),
      PartyFilterFainted,
    );
  }

  /**
   * Revives the {@linkcode Pokemon} at the given index in the Player's party.
   * @param slotIndex - The party slot index of the Pokemon to revive
   */
  private revivePokemonAtSlotIndex(slotIndex: number): void {
    const { currentBattle, phaseManager, ui } = globalScene;
    const pokemon = globalScene.getPlayerParty()[slotIndex];
    if (isNil(pokemon) || !pokemon.isFainted()) {
      this.end();
      return;
    }

    pokemon.resetTurnData();
    pokemon.resetStatus();
    pokemon.heal(toDmgValue(0.5 * pokemon.getMaxHp()));

    phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("moveTriggers:revivalBlessing", { pokemonName: pokemon.name }),
      0,
      true,
    );

    if (currentBattle.double) {
      const ally = this.user.getAlly();
      if (pokemon === ally) {
        this.clearFaintSwitchPhase(pokemon);
        phaseManager.createAndUnshiftPhase("SummonPhase", pokemon.getBattlerIndex(), { playTrainerAnim: false });
      } else if (ally?.isFainted()) {
        this.clearFaintSwitchPhase(pokemon);
        phaseManager.createAndUnshiftPhase("SwitchPhase", ally.getBattlerIndex(), SwitchType.SWITCH, slotIndex);
      }
    }

    ui.setMessageMode()
      .then(() => this.user.setFieldPosition(this.getUserFinalFieldPosition(), 500))
      .then(() => this.end());
  }

  /**
   * Clears the {@linkcode SwitchPhase} for the given fainted Pokemon
   * from the phase queue.
   * @param pokemon - The fainted {@linkcode Pokemon}
   * @todo This is only required because {@linkcode FaintPhase} pushes `SwitchPhases`
   * to fill vacant field slots even though a subsequent Revival Blessing
   * can fill said field slots before the end of the turn. The pushed `SwitchPhases`
   * should be scheduled in {@linkcode TurnEndPhase} instead to make this method obsolete.
   */
  private clearFaintSwitchPhase(pokemon: Pokemon): void {
    globalScene.phaseManager.tryRemovePhase((phase) => phase.is("SwitchPhase") && phase.getPokemon() === pokemon);
  }

  /**
   * @returns The final {@linkcode FieldPosition} the user should move to
   * when this use of Revival Blessing resolves.
   */
  private getUserFinalFieldPosition(): FieldPosition {
    if (!globalScene.currentBattle.double) {
      return FieldPosition.CENTER;
    }

    return this.user.getBattlerIndex() === BattlerIndex.PLAYER ? FieldPosition.LEFT : FieldPosition.RIGHT;
  }
}
