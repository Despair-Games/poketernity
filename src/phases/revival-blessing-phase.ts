import type { PlayerPokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { BattlePhase } from "#app/phases/abstract-battle-phase";
import { SwitchSummonPhase } from "#app/phases/switch-summon-phase";
import { ToggleDoublePositionPhase } from "#app/phases/toggle-double-position-phase";
import { PartyUiMode } from "#enums/party-ui-mode";
import { UiMode } from "#enums/ui-mode";
import { toDmgValue } from "#app/utils";
import { SwitchType } from "#enums/switch-type";
import i18next from "i18next";
import { PartyFilterFainted } from "#app/utils/party-ui-utils";
import { PhaseId } from "#enums/phase-id";

/**
 * Sets the Party UI and handles the effect of Revival Blessing
 * when used by one of the player's Pokemon.
 *
 * @extends BattlePhase
 */
export class RevivalBlessingPhase extends BattlePhase {
  override readonly id = PhaseId.REVIVAL_BLESSING;

  protected readonly user: PlayerPokemon;

  constructor(user: PlayerPokemon) {
    super();

    this.user = user;
  }

  public override start(): void {
    globalScene.ui.setMode(
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
          globalScene.queueMessage(i18next.t("moveTriggers:revivalBlessing", { pokemonName: pokemon.name }), 0, true);

          if (globalScene.currentBattle.double && globalScene.getPlayerParty().length > 1) {
            const allyPokemon = this.user.getAlly();
            if (slotIndex <= 1) {
              // Revived ally pokemon
              globalScene.unshiftPhase(
                new SwitchSummonPhase(SwitchType.SWITCH, pokemon.getFieldIndex(), slotIndex, false, true),
              );
              globalScene.unshiftPhase(new ToggleDoublePositionPhase(true));
            } else if (allyPokemon.isFainted()) {
              // Revived party pokemon, and ally pokemon is fainted
              globalScene.unshiftPhase(
                new SwitchSummonPhase(SwitchType.SWITCH, allyPokemon.getFieldIndex(), slotIndex, false, true),
              );
              globalScene.unshiftPhase(new ToggleDoublePositionPhase(true));
            }
          }
        }
        globalScene.ui.setMode(UiMode.MESSAGE).then(() => this.end());
      },
      PartyFilterFainted,
    );
  }
}
