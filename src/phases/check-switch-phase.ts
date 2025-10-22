import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { MOVE_LOCK_TAG_TYPES } from "#constants/battler-tag-constants";
import { BattleStyle } from "#enums/battle-style";
import { BattlerTagType } from "#enums/battler-tag-type";
import { PartyOption } from "#enums/party-option";
import { PartyUiMode } from "#enums/party-ui-mode";
import { SwitchType } from "#enums/switch-type";
import { UiMode } from "#enums/ui-mode";
import { BattlePhase } from "#phases/base/battle-phase";
import { settings } from "#system/settings-manager";
import type { ConfirmModeConfig } from "#ui/confirm-menu-config";
import type { ConfirmUiHandler } from "#ui/confirm-ui-handler";
import type { PartyUiHandler } from "#ui/party-ui-handler";
import i18next from "i18next";

/**
 * Handles the prompt to switch pokemon at the start of a battle when the player is playing in Switch mode
 */
export class CheckSwitchPhase extends BattlePhase {
  public override readonly phaseName = "CheckSwitchPhase";

  protected readonly fieldIndex: number;
  /** Whether to use the pokemon's name or "Pokemon" when displaying the dialog box */
  protected readonly useName: boolean;

  constructor(fieldIndex: number, useName: boolean) {
    super();

    this.fieldIndex = fieldIndex;
    this.useName = useName;
  }

  public override start(): void {
    const pokemon = globalScene.getPlayerField()[this.fieldIndex];
    const { field, phaseManager, ui } = globalScene;

    // End this phase early...

    // ...if the user is playing in Set Mode
    if (settings.general.battleStyle === BattleStyle.SET) {
      super.end();
      return;
    }

    // ...if the checked Pokemon is somehow not on the field
    if (field.getAll().indexOf(pokemon) === -1) {
      phaseManager.createAndUnshiftPhase("SummonPhase", pokemon.getBattlerIndex(), { delayPostSummon: true });
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

    ui.showText(
      i18next.t("battle:switchQuestion", {
        pokemonName: this.useName ? getPokemonNameWithAffix(pokemon) : i18next.t("battle:pokemon"),
      }),
      {
        callback: () => {
          const options: ConfirmModeConfig = {
            yesHandler: () => this.onConfirm(),
            noHandler: () => this.onCancel(),
          };
          globalScene.ui.setMode<ConfirmUiHandler>(UiMode.CONFIRM, options);
        },
      },
    );
  }

  private onConfirm(): void {
    globalScene.ui.setMode<PartyUiHandler>(
      UiMode.PARTY,
      PartyUiMode.SWITCH,
      this.fieldIndex,
      (cursor: number, option: PartyOption) => this.onPartyModeSelection(cursor, option),
    );
  }

  private onCancel(): void {
    globalScene.ui.setMessageMode().then(() => this.end());
  }

  private onPartyModeSelection(cursor: number, option: PartyOption): void {
    if (option === PartyOption.CANCEL) {
      globalScene.ui.setMessageMode().then(() => this.start());
      return;
    }

    const { phaseManager } = globalScene;
    phaseManager.unshiftPhase(
      phaseManager.createPhase("RecallPhase", this.fieldIndex, SwitchType.INITIAL_SWITCH),
      phaseManager.createPhase("SwitchPhase", this.fieldIndex, SwitchType.INITIAL_SWITCH, cursor),
    );

    globalScene.ui.setMessageMode().then(() => this.end());
  }
}
