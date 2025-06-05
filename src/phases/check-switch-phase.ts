import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { MOVE_LOCK_TAG_TYPES } from "#constants/battler-tag-constants";
import { BattleStyle } from "#enums/battle-style";
import { BattlerTagType } from "#enums/battler-tag-type";
import { PhaseId } from "#enums/phase-id";
import { SwitchType } from "#enums/switch-type";
import { UiMode } from "#enums/ui-mode";
import { BattlePhase } from "#phases/abstract-battle-phase";
import { SummonMissingPhase } from "#phases/summon-missing-phase";
import { SwitchPhase } from "#phases/switch-phase";
import { settings } from "#system/settings-manager";
import type { ConfirmModeConfig } from "#ui/confirm-menu-config";
import type { ConfirmUiHandler } from "#ui/confirm-ui-handler";
import i18next from "i18next";

/**
 * Handles the prompt to switch pokemon at the start of a battle when the player is playing in Switch mode
 * @extends BattlePhase
 */
export class CheckSwitchPhase extends BattlePhase {
  override readonly id = PhaseId.CHECK_SWITCH;

  protected readonly fieldIndex: number;
  /** Whether to use the pokemon's name or "Pokemon" when displaying the dialog box */
  protected readonly useName: boolean;

  constructor(fieldIndex: number, useName: boolean) {
    super();

    this.fieldIndex = fieldIndex;
    this.useName = useName;
  }

  public override start(): void {
    super.start();

    const pokemon = globalScene.getPlayerField()[this.fieldIndex];

    // End this phase early...

    // ...if the user is playing in Set Mode
    if (settings.general.battleStyle === BattleStyle.SET) {
      super.end();
      return;
    }

    // ...if the checked Pokemon is somehow not on the field
    if (globalScene.field.getAll().indexOf(pokemon) === -1) {
      globalScene.phaseManager.unshiftPhase(new SummonMissingPhase(this.fieldIndex));
      this.end();
      return;
    }

    // ...if there are no other allowed Pokemon in the player's party to switch with
    if (
      !globalScene
        .getPlayerParty()
        .slice(1)
        .filter((p) => p.isActive()).length
    ) {
      this.end();
      return;
    }

    // ...or if any player Pokemon has an effect that prevents the checked Pokemon from switching
    if (
      pokemon.hasTag(...MOVE_LOCK_TAG_TYPES)
      || pokemon.isTrapped()
      || globalScene.getPlayerField().some((p) => p.hasTag(BattlerTagType.COMMANDED))
    ) {
      this.end();
      return;
    }

    globalScene.ui.showText(
      i18next.t("battle:switchQuestion", {
        pokemonName: this.useName ? getPokemonNameWithAffix(pokemon) : i18next.t("battle:pokemon"),
      }),
      null,
      () => {
        const options: ConfirmModeConfig = {
          yesHandler: () => {
            globalScene.ui.setMessageMode();
            globalScene.phaseManager.unshiftPhase(
              new SwitchPhase(SwitchType.INITIAL_SWITCH, this.fieldIndex, false, true),
            );
            this.end();
          },
          noHandler: () => {
            globalScene.ui.setMessageMode();
            this.end();
          },
        };
        globalScene.ui.setMode<ConfirmUiHandler>(UiMode.CONFIRM, options);
      },
    );
  }
}
