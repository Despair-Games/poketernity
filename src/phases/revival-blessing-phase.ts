import { globalScene } from "#app/global-scene";
import { PartyUiMode } from "#enums/party-ui-mode";
import { SwitchType } from "#enums/switch-type";
import { UiMode } from "#enums/ui-mode";
import type { PlayerPokemon } from "#field/player-pokemon";
import { BattlePhase } from "#phases/base/battle-phase";
import type { PartyUiHandler } from "#ui/party-ui-handler";
import { toDmgValue } from "#utils/common-utils";
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
    const { currentBattle, phaseManager, ui } = globalScene;
    ui.setMode<PartyUiHandler>(
      UiMode.PARTY,
      PartyUiMode.REVIVAL_BLESSING,
      this.user.getFieldIndex(),
      (slotIndex: number) => {
        if (slotIndex >= 0 && slotIndex < 6) {
          const pokemon = globalScene.getPlayerParty()[slotIndex];
          if (!pokemon || !pokemon.isFainted()) {
            return this.end();
          }

          pokemon.resetTurnData();
          pokemon.resetStatus();
          pokemon.heal(Math.min(toDmgValue(0.5 * pokemon.getMaxHp()), pokemon.getMaxHp()));
          phaseManager.createAndUnshiftPhase(
            "MessagePhase",
            i18next.t("moveTriggers:revivalBlessing", { pokemonName: pokemon.name }),
            0,
            true,
          );

          if (currentBattle.double && globalScene.getPlayerParty().length > 1) {
            const allyPokemon = this.user.getAlly();
            if (slotIndex <= 1) {
              // Revived ally pokemon
              phaseManager.unshiftPhase(
                phaseManager.createPhase(
                  "SwitchSummonPhase",
                  SwitchType.SWITCH,
                  pokemon.getFieldIndex(),
                  slotIndex,
                  false,
                  true,
                ),
                phaseManager.createPhase("ToggleDoublePositionPhase", true),
              );
            } else if (allyPokemon?.isFainted()) {
              // Revived party pokemon, and ally pokemon is fainted
              phaseManager.unshiftPhase(
                phaseManager.createPhase(
                  "SwitchSummonPhase",
                  SwitchType.SWITCH,
                  allyPokemon.getFieldIndex(),
                  slotIndex,
                  false,
                  true,
                ),
                phaseManager.createPhase("ToggleDoublePositionPhase", true),
              );
            }
          }
        }
        ui.setMessageMode().then(() => this.end());
      },
      PartyFilterFainted,
    );
  }
}
