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

    if (settings.general.battleStyle === BattleStyle.SET) {
      super.end();
      return;
    }

    if (!field.getAll().includes(pokemon)) {
      phaseManager.createAndUnshiftPhase("SummonPhase", pokemon.getBattlerIndex(), { delayPostSummon: true });
      this.end();
      return;
    }

    const reservePokemon = globalScene
      .getPlayerParty()
      .slice(1) // shouldn't this be `.slice(doubleBattle ? 2 : 1)`?
      .filter((p) => p.isAllowedInBattle());
    if (reservePokemon.length === 0) {
      this.end();
      return;
    }

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

  private async onCancel(): Promise<void> {
    await globalScene.ui.setMessageMode();
    this.end();
  }

  private async onPartyModeSelection(cursor: number, option: PartyOption): Promise<void> {
    if (option === PartyOption.CANCEL) {
      await globalScene.ui.setMessageMode();
      this.start();
      return;
    }

    const { phaseManager } = globalScene;
    phaseManager.unshiftPhase(
      phaseManager.createPhase("RecallPhase", this.fieldIndex, SwitchType.INITIAL_SWITCH),
      phaseManager.createPhase("SwitchPhase", this.fieldIndex, SwitchType.INITIAL_SWITCH, cursor),
    );

    await globalScene.ui.setMessageMode();
    this.end();
  }
}
