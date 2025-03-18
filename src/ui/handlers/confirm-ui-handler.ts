import type { ConfirmModeConfig } from "#app/ui/interfaces/confirm-menu-config";
import type { OptionSelectItem, OptionSelectModeConfig } from "#app/ui/interfaces/option-select-config";
import { UiMode } from "#enums/ui-mode";
import i18next from "i18next";
import { AbstractOptionSelectUiHandler } from "./abstract-option-select-ui-handler";

/**
 * Handler that displays a simple Yes/No menu.
 * @extends OptionSelectUiHandler
 */
export class ConfirmUiHandler extends AbstractOptionSelectUiHandler<OptionSelectItem> {
  constructor() {
    super(UiMode.CONFIRM);
  }

  override show(config?: ConfirmModeConfig): boolean {
    /*
     * `config` is optional but the function exists early if undefined because ME phase utils' `selectPokemonForOption`
     * and `selectOptionThenPokemon` finish by calling `ui.setMode(modeThatWasUsedWhenItWasCalled)`
     * which results in some cases in setMode(UiMode.CONFIRM) being called without parameters.
     * TODO: Once those functions' behavior is fixed config should no longer be optional.
     */
    if (!config) {
      console.warn("Missing `ConfirmModeConfig` argument for Mode.CONFIRM");
      return false;
    }

    const fullConfig: OptionSelectModeConfig = {
      ...config,
      yOffset: config.yOffset ?? 48,
      options: [
        {
          label: i18next.t("menu:yes"),
          handler: () => {
            config.yesHandler();
            return true;
          },
        },
        {
          label: i18next.t("menu:no"),
          handler: () => {
            config.noHandler();
            return true;
          },
        },
      ],
    };

    return super.show(fullConfig);
  }
}
