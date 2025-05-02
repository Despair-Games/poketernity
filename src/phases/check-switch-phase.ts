import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlePhase } from "#app/phases/abstract-battle-phase";
import { SummonMissingPhase } from "#app/phases/summon-missing-phase";
import { SwitchPhase } from "#app/phases/switch-phase";
import { settings } from "#app/system/settings/settings-manager";
import type { ConfirmUiHandler } from "#app/ui/handlers/confirm-ui-handler";
import type { ConfirmModeConfig } from "#app/ui/interfaces/confirm-menu-config";
import { MoveLockTagTypes } from "#app/utils/battler-tag-type-utils";
import { BattleStyle } from "#enums/battle-style";
import { BattlerTagType } from "#enums/battler-tag-type";
import { PhaseId } from "#enums/phase-id";
import { SwitchType } from "#enums/switch-type";
import { UiMode } from "#enums/ui-mode";
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
      return super.end();
    }

    // ...if the checked Pokemon is somehow not on the field
    if (globalScene.field.getAll().indexOf(pokemon) === -1) {
      globalScene.phaseManager.unshiftPhase(new SummonMissingPhase(this.fieldIndex));
      return this.end();
    }

    // ...if there are no other allowed Pokemon in the player's party to switch with
    if (
      !globalScene
        .getPlayerParty()
        .slice(1)
        .filter((p) => p.isActive()).length
    ) {
      return this.end();
    }

    // ...or if any player Pokemon has an effect that prevents the checked Pokemon from switching
    if (
      pokemon.getTag(...MoveLockTagTypes)
      || pokemon.isTrapped()
      || globalScene.getPlayerField().some((p) => p.getTag(BattlerTagType.COMMANDED))
    ) {
      return this.end();
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
